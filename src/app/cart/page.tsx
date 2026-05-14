'use client';
import { useCart } from '@/context/CartContext';
import { ProductController } from '@/controllers/ProductController';
import { OrderController } from '@/controllers/OrderController';
import { AddressController } from '@/controllers/AddressController';
import { VoucherController } from '@/controllers/VoucherController';
import { MyVoucher } from '@/models/Voucher';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, MapPin, CreditCard as CardIcon, Ticket, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Address } from '@/models/Address';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    selectedTotalPrice,
    itemCount,
    clearCart,
    toggleSelection,
    toggleSelectAll,
    selectedItemIds
  } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [applicableVouchers, setApplicableVouchers] = useState<MyVoucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<MyVoucher | null>(null);
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState<number>(0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      const addrList = await AddressController.getAddresses();
      setAddresses(addrList);
      const defaultAddr = addrList.find(a => a.is_default) || addrList[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedTotalPrice > 0) {
      VoucherController.getApplicableVouchers(selectedTotalPrice).then(vouchers => {
        const safeVouchers = Array.isArray(vouchers) ? vouchers : [];
        setApplicableVouchers(safeVouchers);
        if (selectedVoucher) {
          const isValid = safeVouchers.find(v => v.id === selectedVoucher.id);
          if (!isValid) {
            setSelectedVoucher(null);
            setAppliedDiscountAmount(0);
          } else {
            VoucherController.applyVoucher(selectedVoucher.voucher_id, selectedTotalPrice).then(res => {
              if (res.valid) {
                setAppliedDiscountAmount(res.discount_amount);
              } else {
                setSelectedVoucher(null);
                setAppliedDiscountAmount(0);
              }
            });
          }
        }
      });
    } else {
      setApplicableVouchers([]);
      setSelectedVoucher(null);
      setAppliedDiscountAmount(0);
    }
  }, [selectedTotalPrice]);

  const handleCheckout = async () => {
    if (selectedItemIds.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để mua');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }

    try {
      setIsProcessing(true);

      const orderItems = items
        .filter(item => selectedItemIds.includes(item.id))
        .map(item => ({
          product_id: Number(item.id),
          quantity: item.quantity
        }));

      if (orderItems.length === 0) {
        toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
        return;
      }

      const orderData: any = {
        items: orderItems,
        address_id: selectedAddressId,
        payment_method: paymentMethod
      };

      if (selectedVoucher) {
        orderData.voucher_id = selectedVoucher.voucher_id;
      }

      console.log('Sending order data:', orderData);
      const result = await OrderController.createOrder(orderData);
      console.log('Order creation result:', result);

      // If payment method is vnpay, the response contains a payment URL
      // We check for both paymentUrl and payment_url to be safe
      const paymentUrl = result.paymentUrl || result.payment_url;

      if (paymentMethod === 'vnpay') {
        if (paymentUrl) {
          if (result.order?.id) {
            localStorage.setItem(`vnpay_url_${result.order.id}`, paymentUrl);
          }
          await clearCart();
          window.location.href = paymentUrl;
          return;
        } else {
          console.error('Payment URL not found in response:', result);
          toast.error('Không tìm thấy liên kết thanh toán VNPAY.');
        }
      }

      toast.success('Đặt hàng thành công!');
      await clearCart();

      // Redirect to the newly created order's detail page
      if (result.order?.id) {
        router.push(`/orders/${result.order.id}`);
      } else {
        router.push('/orders');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalPrice = Math.max(0, selectedTotalPrice - appliedDiscountAmount);

  const isAllSelected = selectedItemIds.length === items.length && items.length > 0;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link href="/" className="btn-brand px-8 py-3 inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        Giỏ hàng của bạn <span className="text-gray-400 font-normal">({itemCount} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-between gap-3">
            <div className='flex items-center gap-2'>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <span className="font-semibold text-gray-700">Chọn tất cả ({items.length} sản phẩm)</span>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors "
            >
              Xóa tất cả
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 border border-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItemIds.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </div>
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug hover:text-orange-500">
                    <Link href={`/product/${item.id}`}>{item.title}</Link>
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-orange-500 font-bold mb-3">{ProductController.formatPrice(item.price)}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-50 text-gray-500"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-50 text-gray-500"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">
                    {ProductController.formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
          >
            Xóa tất cả sản phẩm
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">

          {/* Address Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" /> Địa chỉ nhận hàng
            </h3>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <label key={addr.id} className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="text-sm">
                        <p className="font-bold">{addr.recipient_name} | {addr.phone}</p>
                        <p className="text-gray-500">{addr.street}, {addr.ward}, {addr.district}, {addr.province}</p>
                      </div>
                    </div>
                  </label>
                ))}
                <Link href="/profile" className="text-sm text-orange-500 hover:underline block text-center">+ Thêm địa chỉ mới</Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">Bạn chưa có địa chỉ nào</p>
                <Link href="/profile" className="btn-brand py-2 px-4 text-sm">Thêm địa chỉ</Link>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CardIcon size={18} className="text-orange-500" /> Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('vnpay')}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${paymentMethod === 'vnpay' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-500'}`}
              >
                VNPAY
              </button>
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-500'}`}
              >
                COD
              </button>
            </div>
          </div>

          {/* Voucher Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Ticket size={18} className="text-orange-500" /> Mã giảm giá
            </h3>
            {selectedVoucher ? (
              <div className="flex justify-between items-center p-3 border border-orange-200 bg-orange-50 rounded-xl">
                <div>
                  <p className="font-bold text-orange-600">{selectedVoucher.voucher.code}</p>
                  <p className="text-xs text-orange-500">Giảm {ProductController.formatPrice(appliedDiscountAmount)}</p>
                </div>
                <button onClick={() => setShowVoucherModal(true)} className="text-sm font-semibold text-orange-600 hover:text-orange-700">Đổi mã</button>
              </div>
            ) : (
              <button
                onClick={() => setShowVoucherModal(true)}
                disabled={applicableVouchers.length === 0}
                className={`w-full flex justify-between items-center p-3 border rounded-xl transition-all ${applicableVouchers.length > 0
                    ? 'border-gray-200 hover:border-orange-200 hover:bg-orange-50 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-70'
                  }`}
              >
                <span className={applicableVouchers.length > 0 ? "text-gray-700 font-medium" : "text-gray-400"}>Chọn hoặc nhập mã giảm giá</span>
                <span className={applicableVouchers.length > 0 ? "text-orange-500 font-semibold" : "text-gray-400"}>{applicableVouchers.length} mã khả dụng</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Tổng cộng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính </span>
                <span>{ProductController.formatPrice(selectedTotalPrice)}</span>
              </div>
              {selectedVoucher && (
                <div className="flex justify-between text-orange-500">
                  <span>Giảm giá</span>
                  <span>-{ProductController.formatPrice(appliedDiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-500 font-medium">Miễn phí</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between font-black text-xl text-gray-900">
                <span>Tổng tiền</span>
                <span className="text-orange-500">{ProductController.formatPrice(finalPrice)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={selectedItemIds.length === 0 || isProcessing}
              className={`w-full py-4 font-bold text-lg rounded-xl shadow-lg transition-all active:scale-[0.98] ${selectedItemIds.length > 0 && !isProcessing
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isProcessing ? 'ĐANG XỬ LÝ...' : `MUA HÀNG `}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Hỗ trợ thanh toán qua thẻ, ví điện tử hoặc COD
            </p>
          </div>
        </div>
      </div>

      {showVoucherModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Chọn mã giảm giá</h3>
              <button onClick={() => setShowVoucherModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50">
              {applicableVouchers.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Không có mã nào áp dụng cho đơn hàng này.</p>
                </div>
              ) : (
                applicableVouchers?.map(v => (
                  <label key={v.id} className={`bg-white rounded-xl p-3 border flex gap-3 shadow-sm cursor-pointer transition-all ${selectedVoucher?.id === v.id ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-200'}`}>
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-lg flex flex-col justify-center items-center font-bold">
                      <span className="text-lg">{v.voucher.type === 'percent' ? `${v.voucher.discount_value}%` : `${v.voucher.discount_value / 1000}k`}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{v.voucher.code}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{v.voucher.name}</p>
                      <p className="text-xs text-orange-500 font-semibold mt-1">Giảm {ProductController.formatPrice(v.voucher.actualDiscount!)}</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="voucher"
                        checked={selectedVoucher?.id === v.id}
                        onChange={async () => {
                          setShowVoucherModal(false);
                          const result = await VoucherController.applyVoucher(v.voucher_id, selectedTotalPrice);
                          if (result.valid) {
                            setSelectedVoucher(v);
                            setAppliedDiscountAmount(result.discount_amount);
                            toast.success(`Áp dụng thành công, giảm ${ProductController.formatPrice(result.discount_amount)}`);
                          } else {
                            toast.error(result.message);
                            setSelectedVoucher(null);
                            setAppliedDiscountAmount(0);
                          }
                        }}
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 cursor-pointer"
                      />
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
              <button
                onClick={() => {
                  setSelectedVoucher(null);
                  setAppliedDiscountAmount(0);
                  setShowVoucherModal(false);
                }}
                className="w-full py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
              >
                Không dùng mã giảm giá
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
