export interface Buy {
  identifier?: number;
  code: string; 
  buysDate: string;
  totalPrice?: number;
  user_identifier: number;
  supplier_identifier: number;
  payment_method: string;
  details: BuyDetail[];
}

export interface BuyDetail {
  amount: number;
  unitCost: number;
  subtotal: number;
  product_identifier: number;
}