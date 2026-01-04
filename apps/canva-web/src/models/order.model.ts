import { Product } from "./product.model";

export type Order = {
  id: number;
  products: Product[];
  total: number;
  payment_status: string;
  payment_intent_id: string;
  email: string;
};