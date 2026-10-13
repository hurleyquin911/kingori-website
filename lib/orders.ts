"use client";

import { createLocalStore } from "./local-store";

export type Dropshipper = {
  name: string;
  phone: string;
  shop: string;
};

export type SavedAddress = {
  name: string;
  phone: string;
  email: string;
  label: string;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  street: string;
  landmark: string;
};

const savedAddressStore = createLocalStore<SavedAddress | null>("kingori-last-address-v1", null);

export const saveLastAddress = (address: SavedAddress) => savedAddressStore.set(address);
export const useLastAddress = () => savedAddressStore.useValue();

const dropshipperStore = createLocalStore<Dropshipper | null>("kingori-dropshipper-v1", null);

export const saveDropshipper = (d: Dropshipper) => dropshipperStore.set(d);
export const useSavedDropshipper = () => dropshipperStore.useValue();
