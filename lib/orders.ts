"use client";

import { createLocalStore } from "./local-store";
import type { ArtKind } from "./products";

export type OrderItem = {
  slug: string;
  name: string;
  variant: string | null;
  qty: number;
  price: number;
  art: ArtKind;
  accent: string;
};

export type Dropshipper = {
  name: string;
  phone: string;
  shop: string;
};

export type Order = {
  id: string;
  createdAt: string;
  expiresAt: string;
  status: "menunggu-pembayaran" | "menunggu-verifikasi";
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    label: string;
    province: string;
    city: string;
    district: string;
    village: string;
    postalCode: string;
    street: string;
    landmark: string;
  };
  shipping: {
    id: string;
    courier: string;
    service: string;
    eta: string;
    cost: number;
    discount: number;
    insurance: number;
    weightKg: number;
  };
  payment: {
    method: "transfer" | "qris";
    bankId: string | null;
  };
  dropship?: Dropshipper | null;
  note: string;
  subtotal: number;
  uniqueCode: number;
  total: number;
};

const EMPTY: Order[] = [];
const orderStore = createLocalStore<Order[]>("kingori-orders-v1", EMPTY);

export function saveOrder(order: Order) {
  orderStore.set((orders) => [order, ...orders]);
}

export function markOrderConfirmed(id: string) {
  orderStore.set((orders) =>
    orders.map((o) => (o.id === id ? { ...o, status: "menunggu-verifikasi" } : o)),
  );
}

export function useOrders() {
  return orderStore.useValue();
}

export type SavedAddress = Order["customer"] & Order["address"];

const savedAddressStore = createLocalStore<SavedAddress | null>("kingori-last-address-v1", null);

export const saveLastAddress = (address: SavedAddress) => savedAddressStore.set(address);
export const useLastAddress = () => savedAddressStore.useValue();

const dropshipperStore = createLocalStore<Dropshipper | null>("kingori-dropshipper-v1", null);

export const saveDropshipper = (d: Dropshipper) => dropshipperStore.set(d);
export const useSavedDropshipper = () => dropshipperStore.useValue();

export function createOrderMeta(deadlineHours: number) {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return {
    id: `KO-${y}${m}${d}-${rand}`,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + deadlineHours * 3_600_000).toISOString(),
    uniqueCode: Math.floor(Math.random() * 399) + 101,
  };
}
