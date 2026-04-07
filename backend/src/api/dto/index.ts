import { LinkStatus } from "@shared/schemas/validators";
import { Link, Merchant } from "src/models";

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
  status: LinkStatus | undefined
  amount: number | undefined
  expiresAt: Date | undefined 
  createdAt: Date | undefined 
  updatedAt: Date | undefined 

  constructor(link: Link | null) {
    this.id = link?.id || "";
    this.shortCode = link?.shortCode || 0 ;
    this.amount = link?.amount || 0 ;
    this.url = link?.url || "";
    this.status = link?.status
    this.expiresAt = link?.expiresAt
    this.createdAt = link?.createdAt
    this.updatedAt = link?.updatedAt
  }

  static create(link: Link | null) {
    return new LinkDTO(link);
  }
}



