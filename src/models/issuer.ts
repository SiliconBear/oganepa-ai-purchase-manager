import { Document, ObjectId } from "bson";

export type Issuer = {
  _id: ObjectId;
  biller?: string;
  country?: ObjectId;
  createdAt?: Date;
  description?: string;
  name?: string;
  serviceName?: string;
  shortcode?: string;
  status?: ObjectId;
  updatedAt?: Date;
};

export const IssuerSchema = {
  name: "issuer",
  properties: {
    _id: "objectId?",
    biller: "string?",
    country: "objectId?",
    createdAt: "date?",
    description: "string?",
    name: "string?",
    serviceName: "string?",
    shortcode: "string?",
    status: "objectId?",
    updatedAt: "date?",
  },
  primaryKey: "_id",
};
