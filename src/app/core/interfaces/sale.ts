export interface Sale {
  identifier: number;
  issueDate: string;
  paymentMethod: string;
  customerIdentifier: number;
  userIdentifier: number;
  total_price?: number;
}

export interface SaleWithDetails {
  identifier: number;
  code: string;
  issueDate: string;
  paymentMethod: string;
  customerIdentifier: number;
  userIdentifier: number;
  customerName?: string;
  userName?: string;
  details: SaleDetail[];
}

export interface SaleDetail {
  productIdentifier: number;
  amount: number;
  subtotal: number;
  unitPrice?: number; // opcional para form
}

export interface SaleCreate {
  issueDate: string;
  paymentMethod: string;
  customerIdentifier: number;
  userIdentifier: number;
  total_price: number;
  details: SaleDetail[];
}
