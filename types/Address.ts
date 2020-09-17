import { Schema } from "mongoose";

export interface AddressType extends Schema {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}
