// TypeScript type definitions for DukaScan

export interface Product {
  barcode: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
}

export interface SettingsData {
  scriptUrl: string;
}

export type RootStackParamList = {
  Scanner: undefined;
  ProductForm: { barcode: string };
};

export type RootTabParamList = {
  Home: undefined;
  Settings: undefined;
};
