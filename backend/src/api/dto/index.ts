import {
  LinkStatus,
  PaymentStatus,
  TX,
  ConfigEnv,
} from "@paylink/shared";
import { Link, Merchant, Config } from "../models";

export class UserDTO {
  id: string;
  businessName: string;
  phoneNumber: string;

  constructor(user: Merchant | null) {
    this.id = user?.id || "";
    this.businessName = user?.business_name || "";
    this.phoneNumber = user?.phone_number || "";
  }

  static create(user: Merchant | null) {
    return new UserDTO(user);
  }
}
export class LinkDTO {
  id: string | undefined;
  shortCode: number | undefined;
  url: string | undefined;
  status: LinkStatus | undefined;
  amount: number | undefined;
  expiresAt: Date | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor(link: Link | null) {
    this.id = link?.id || "";
    this.shortCode = link?.shortCode || 0;
    this.amount = link?.amount || 0;
    this.url = link?.url || "";
    this.status = link?.status;
    this.expiresAt = link?.expiresAt;
    this.createdAt = link?.createdAt;
    this.updatedAt = link?.updatedAt;
  }

  static create(link: Link | null) {
    return new LinkDTO(link);
  }
}

export class paymentsDTO {
  id: string;
  status: PaymentStatus | undefined;
  businessName: string;
  clientName: string;
  phoneNumber: string;
  amount: string;
  mpesaRef: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor(payment: TX | null) {
    this.id = payment?.id || "";
    this.status = payment?.status as PaymentStatus;
    this.businessName = payment?.businessName || "";
    this.clientName = payment?.clientName.split("@")[0] || "";
    this.phoneNumber = payment?.phoneNumber || "";
    this.amount = payment?.amount || "";
    this.mpesaRef = payment?.mpesaRef || "";
    this.createdAt = payment?.createdAt;
    this.updatedAt = payment?.updatedAt;
  }

  static create(payment: null) {
    return new paymentsDTO(payment);
  }
}
export class ConfigDTO {
  id: string;
  env: ConfigEnv;
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passKey: string;
  callbackUrl: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(config: Config | null) {
    this.id = config?.id || "";
    this.env = config?.env || "Sandbox";
    this.consumerKey = config?.consumer_key || "";
    this.consumerSecret = config?.consumer_secret || "";
    this.shortCode = config?.short_code || "";
    this.passKey = config?.pass_Key || "";
    this.callbackUrl = config?.callback_url || "";
    this.createdAt = config?.createdAt;
    this.updatedAt = config?.updatedAt;
  }

  static create(config: Config | null) {
    return new ConfigDTO(config);
  }
}
