import { ObjectId } from "bson";

export type Purchase = {
  _id: ObjectId;
  amount?: number;
  biller?: string;
  buyer?: ObjectId;
  createdAt?: Date;
  currency?: string;
  email?: string;
  lastUpdatedAt?: Date;
  meternumber?: string;
  phone?: string;
  serviceCharge?: number;
  serviceName?: string;
  status?: string;
  token?: string;
  total?: number;
  vat?: number;
};

export const PurchaseSchema = {
  name: "Purchase",
  properties: {
    _id: "objectId?",
    amount: "int?",
    biller: "string?",
    buyer: "objectId?",
    createdAt: "date?",
    currency: "string?",
    email: "string?",
    lastUpdatedAt: "date?",
    meternumber: "string?",
    phone: "string?",
    serviceCharge: "int?",
    serviceName: "string?",
    status: "string?",
    token: "string?",
    total: "int?",
    vat: "int?",
  },
  primaryKey: "_id",
};
