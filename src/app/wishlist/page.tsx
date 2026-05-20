'use client';

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { WishlistController, WishlistItem } from '@/controllers/WishlistController';
import { Trash2, Edit2, Share2, Bell, BellOff, ShoppingCart, Info, Loader2, Heart, Sparkles, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ProductController } from '@/controllers/ProductController';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const {
    wishlists,
    activeWishlistId,
    setActiveWishlistId,
    createWishlist,
    deleteWishlist,
    renameWishlist,
    toggleWishlistItem,
    isLoading: contextLoading,
  } = useWishlist();

  const router = useRouter();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const [deleteListConfirm, setDeleteListConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [deleteItemConfirm, setDeleteItemConfirm] = useState<{
    id: number;
    product_id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      toast.info('Vui lòng đăng nhập để xem danh sách yêu thích');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (activeWishlistId) {
      loadItems(activeWishlistId);
    } else {
      setItems([]);
      setTotalItems(0);
    }
  }, [activeWishlistId]);

  const loadItems = async (wishlistId: number) => {
    setIsLoadingItems(true);
    const res = await WishlistController.getWishlistItems(wishlistId, { limit: 50 });

    if (res) {
      setItems(res.items);
      setTotalItems(res.total);
    }

    setIsLoadingItems(false);
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) {
      toast.error('Vui lòng nhập tên danh sách');
      return;
    }

    await createWishlist(newListName);
    setNewListName('');
    setIsCreateModalOpen(false);
    toast.success('Tạo danh sách thành công');
  };

  const executeDeleteList = async () => {
    if (!deleteListConfirm) return;

    const success = await deleteWishlist(deleteListConfirm.id);

    if (success) toast.success('Đã xóa danh sách');
    else toast.error('Không thể xóa danh sách này');

    setDeleteListConfirm(null);
  };

  const executeDeleteItem = async () => {
    if (!deleteItemConfirm) return;

    const success = await toggleWishlistItem(
      deleteItemConfirm.product_id,
      activeWishlistId || undefined,
    );

    if (success) {
      setItems(prev => prev.filter(i => i.id !== deleteItemConfirm.id));
      setTotalItems(prev => Math.max(prev - 1, 0));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    }

    setDeleteItemConfirm(null);
  };

  const handleDeleteListClick = (
    e: React.MouseEvent,
    id: number,
    name: string,
  ) => {
    e.stopPropagation();
    setDeleteListConfirm({ id, name });
  };

  const handleRenameList = async (id: number, oldName: string) => {
    const newName = window.prompt('Nhập tên mới:', oldName);

    if (newName && newName.trim() !== '' && newName !== oldName) {
      const success = await renameWishlist(id, newName);
      if (success) toast.success('Đã đổi tên danh sách');
      else toast.error('Lỗi đổi tên');
    }
  };

  const handleShareList = async (id: number) => {
    try {
      const token = await WishlistController.generateShareLink(id);

      if (token) {
        const url = `${window.location.origin}/wishlist/public/${token}`;
        await navigator.clipboard.writeText(url);
        toast.success('Đã sao chép link chia sẻ');
      } else {
        toast.error('Không thể tạo link chia sẻ');
      }
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const WishlistItemCard = ({ item }: { item: WishlistItem }) => {
    const { addToCart } = useCart();

    const [isMoving, setIsMoving] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteContent, setNoteContent] = useState(item.note || '');
    const [priceAlert, setPriceAlert] = useState(item.price_alert);
    const [stockAlert, setStockAlert] = useState(item.stock_alert);

    const handleMoveToCart = async () => {
      if (item.product.is_out_of_stock) {
        toast.error('Sản phẩm đã hết hàng');
        return;
      }

      setIsMoving(true);

      const success = await WishlistController.moveToCart(item.id);

      if (success) {
        setItems(prev => prev.filter(i => i.id !== item.id));
        setTotalItems(prev => Math.max(prev - 1, 0));

        addToCart(
          {
            id: item.product.id,
            title: item.product.name,
            price: item.product.price,
            image: item.product.image_url || '',
            location: '',
            category: '',
            categorySlug: '',
            condition: 'new',
            postedAt: new Date().toISOString(),
            seller: 'System',
          },
          1,
        );

        toast.success('Đã chuyển sang giỏ hàng');
      } else {
        toast.error('Lỗi chuyển giỏ hàng');
        setIsMoving(false);
      }
    };

    const handleSaveNote = async () => {
      const val = noteContent.trim() || null;
      const success = await WishlistController.updateItemNote(item.id, val);

      if (success) {
        item.note = val;
        setShowNoteInput(false);
        toast.success('Đã lưu ghi chú');
      }
    };

    const handleRemoveItem = () => {
      setDeleteItemConfirm({
        id: item.id,
        product_id: item.product.id,
        name: `${item.product.product_line_name} (${item.product.name})`,
      });
    };

    const handleTogglePriceAlert = async () => {
      setPriceAlert(!priceAlert);

      try {
        const res = await WishlistController.togglePriceAlert(item.id);
        if (res) {
          toast.success(
            res.price_alert
              ? 'Đã bật thông báo giảm giá'
              : 'Đã tắt thông báo giảm giá',
          );
        }
      } catch {
        setPriceAlert(priceAlert);
      }
    };

    const handleToggleStockAlert = async () => {
      setStockAlert(!stockAlert);

      try {
        const res = await WishlistController.toggleStockAlert(item.id);
        if (res) {
          toast.success(
            res.stock_alert
              ? 'Đã bật thông báo có hàng'
              : 'Đã tắt thông báo có hàng',
          );
        }
      } catch {
        setStockAlert(stockAlert);
      }
    };

    return (
      <div className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr]">
          <Link
            href={`/product/${item.product.product_line_id}?variant=${item.product.id}`}
            className="relative h-40 overflow-hidden rounded-2xl bg-orange-50 sm:h-full"
          >
            <img
              src={item.product.image_url || ''}
              alt={item.product.name}
              className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${item.product.is_out_of_stock ? 'opacity-50 grayscale' : ''
                }`}
            />

            {item.product.is_out_of_stock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                  HẾT HÀNG
                </span>
              </div>
            )}
          </Link>

          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/product/${item.product.product_line_id}?variant=${item.product.id}`}
                className="line-clamp-2 text-base font-black text-slate-900 transition hover:text-orange-600"
              >
                {item.product.product_line_name}
                <span className="font-medium text-slate-500">
                  {' '}
                  ({item.product.name})
                </span>
              </Link>

              <button
                onClick={handleRemoveItem}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                title="Xóa khỏi danh sách"
              >
                <Trash2 size={17} />
              </button>
            </div>

            <p className="mt-2 text-xl font-black text-[#FB6A01]">
              {ProductController.formatPrice(item.product.price)}
            </p>

            <div className="mt-3">
              {item.note && !showNoteInput ? (
                <div className="flex items-start gap-2 rounded-2xl border border-yellow-100 bg-yellow-50 p-3 text-xs text-slate-700">
                  <Info size={15} className="mt-0.5 shrink-0 text-yellow-600" />
                  <span className="flex-1">{item.note}</span>
                  <button
                    onClick={() => setShowNoteInput(true)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              ) : showNoteInput ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    className="flex-1 rounded-xl border border-orange-100 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="Ghi chú sản phẩm..."
                    maxLength={500}
                  />
                  <button
                    onClick={handleSaveNote}
                    className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteInput(false);
                      setNoteContent(item.note || '');
                    }}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600"
                >
                  + Thêm ghi chú
                </button>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-4 lg:flex-row lg:items-center lg:justify-between">
              <button
                onClick={handleMoveToCart}
                disabled={isMoving || item.product.is_out_of_stock}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FB6A01] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isMoving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShoppingCart size={16} />
                )}
                Chuyển sang giỏ
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTogglePriceAlert}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${priceAlert
                    ? 'border-orange-200 bg-orange-50 text-orange-600'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                >
                  {priceAlert ? <Bell size={13} /> : <BellOff size={13} />}
                  Giảm giá
                </button>

                <button
                  onClick={handleToggleStockAlert}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${stockAlert
                    ? 'border-orange-200 bg-orange-50 text-orange-600'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                >
                  {stockAlert ? <Bell size={13} /> : <BellOff size={13} />}
                  Có hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (contextLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FB6A01] via-orange-500 to-rose-500 p-6 text-white shadow-2xl md:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur-xl">
                <Sparkles size={14} />
                Wishlist Center
              </p>

              <h1 className="mt-4 text-3xl font-black md:text-5xl">
                Danh sách yêu thích
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-50">
                Lưu sản phẩm bạn thích, theo dõi giá, nhận thông báo có hàng và chuyển nhanh sang giỏ hàng khi cần.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#FB6A01] shadow-xl transition hover:-translate-y-0.5 hover:bg-orange-50"
            >
              <Plus size={17} />
              Tạo danh sách mới
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                  Bộ sưu tập
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {wishlists.length} danh sách
                </p>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition hover:bg-orange-100"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {wishlists.map(w => (
                <button
                  key={w.id}
                  onClick={() => setActiveWishlistId(w.id)}
                  className={`group w-full rounded-2xl border p-3 text-left transition ${activeWishlistId === w.id
                    ? 'border-orange-200 bg-orange-50 shadow-sm'
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-black ${activeWishlistId === w.id
                          ? 'text-orange-700'
                          : 'text-slate-800'
                          }`}
                      >
                        {w.is_default === 1 ? '⭐' : '📋'} {w.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Nhấn để xem sản phẩm
                      </p>
                    </div>

                    {activeWishlistId === w.id && (
                      <div className="flex shrink-0 items-center gap-1">
                        <span
                          onClick={e => {
                            e.stopPropagation();
                            handleShareList(w.id);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-orange-600"
                        >
                          <Share2 size={14} />
                        </span>

                        {w.is_default === 0 && (
                          <>
                            <span
                              onClick={e => {
                                e.stopPropagation();
                                handleRenameList(w.id, w.name);
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-orange-600"
                            >
                              <Edit2 size={14} />
                            </span>

                            <span
                              onClick={e => handleDeleteListClick(e, w.id, w.name)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-orange-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
                  Sản phẩm đã lưu
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Có {totalItems} sản phẩm trong danh sách
                </h2>
              </div>

              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
              >
                <ShoppingBag size={16} />
                Tiếp tục mua sắm
              </Link>
            </div>

            {isLoadingItems ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm">
                  <Heart size={32} />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-900">
                  Chưa có sản phẩm nào
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Hãy thêm sản phẩm bạn yêu thích để theo dõi giá, nhận thông báo có hàng và mua nhanh hơn.
                </p>

                <Link
                  href="/"
                  className="mt-6 rounded-2xl bg-[#FB6A01] px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map(item => (
                  <WishlistItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      {isCreateModalOpen && (
        <ConfirmModal
          title="Tạo danh sách mới"
          onClose={() => setIsCreateModalOpen(false)}
          footer={
            <>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>

              <button
                onClick={handleCreateNewList}
                className="rounded-xl bg-[#FB6A01] px-4 py-2 font-bold text-white hover:bg-orange-600"
              >
                Tạo mới
              </button>
            </>
          }
        >
          <input
            type="text"
            className="w-full rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-400"
            placeholder="Ví dụ: Mùa hè 2026, Công nghệ..."
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreateNewList()}
          />
        </ConfirmModal>
      )}

      {deleteListConfirm && (
        <ConfirmModal
          title="Xóa danh sách"
          danger
          onClose={() => setDeleteListConfirm(null)}
          footer={
            <>
              <button
                onClick={() => setDeleteListConfirm(null)}
                className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>

              <button
                onClick={executeDeleteList}
                className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </>
          }
        >
          <p className="text-sm leading-6 text-slate-600">
            Bạn có chắc chắn muốn xóa danh sách{' '}
            <strong>"{deleteListConfirm.name}"</strong> không?
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Hành động này sẽ xóa toàn bộ sản phẩm bên trong và không thể hoàn tác.
          </p>
        </ConfirmModal>
      )}

      {deleteItemConfirm && (
        <ConfirmModal
          title="Bỏ lưu yêu thích"
          danger
          onClose={() => setDeleteItemConfirm(null)}
          footer={
            <>
              <button
                onClick={() => setDeleteItemConfirm(null)}
                className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>

              <button
                onClick={executeDeleteItem}
                className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </>
          }
        >
          <p className="text-sm leading-6 text-slate-600">
            Bạn có muốn xóa <strong>"{deleteItemConfirm.name}"</strong> khỏi danh sách không?
          </p>
        </ConfirmModal>
      )}
    </main>
  );
}

function ConfirmModal({
  title,
  children,
  footer,
  danger = false,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  danger?: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 p-5">
          <h3
            className={`flex items-center gap-2 text-lg font-black ${danger ? 'text-red-600' : 'text-slate-900'
              }`}
          >
            {danger && <Trash2 size={20} />}
            {title}
          </h3>
        </div>

        <div className="p-5">{children}</div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-4">
          {footer}
        </div>
      </div>
    </div>
  );
}
