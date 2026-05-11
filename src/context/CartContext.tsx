'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/models/Product';
import { CartController, CartItem } from '@/controllers/CartController';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleSelection: (productId: string | number) => void;
  toggleSelectAll: () => void;
  selectedItemIds: (string | number)[];
  itemCount: number;
  totalPrice: number;
  selectedTotalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncCart = async () => {
      setIsLoading(true);
      const sessionId = localStorage.getItem('sessionId');

      if (sessionId) {
        const serverItems = await CartController.getCart();
        if (serverItems.length > 0) {
          setItems(serverItems);
          setSelectedItemIds(serverItems.map(i => i.id));
          setIsLoading(false);
          return;
        }
      }
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setItems(parsed);
          setSelectedItemIds(parsed.map((item: CartItem) => item.id));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
      setIsLoading(false);
    };

    syncCart();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('sessionId')) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const sessionId = localStorage.getItem('sessionId');

    if (sessionId) {
      const success = await CartController.addToCart(product.id, quantity);
      if (!success) {
        console.error('Failed to sync addToCart with server');
      }
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // If new item, add to selected list as well
      setSelectedItemIds(prev => [...prev, product.id]);
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = async (productId: string | number) => {
    if (!productId) {
      console.warn('Attempted to remove product with undefined ID');
      return;
    }
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      await CartController.removeFromCart(productId);
    }
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
    setSelectedItemIds(prev => prev.filter(id => id !== productId));
  };

  const updateQuantity = async (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      await CartController.updateQuantity(productId, quantity);
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      await CartController.clearCart();
    }
    setItems([]);
    setSelectedItemIds([]);
  };

  const toggleSelection = (productId: string | number) => {
    setSelectedItemIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map(item => item.id));
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const selectedTotalPrice = items
    .filter(item => selectedItemIds.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleSelection,
      toggleSelectAll,
      selectedItemIds,
      itemCount,
      totalPrice,
      selectedTotalPrice,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
