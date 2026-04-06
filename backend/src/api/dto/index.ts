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
  expiresAt: Date | undefined 

  constructor(link: Link | null) {
    this.id = link?.id || "";
    this.shortCode = link?.shortCode || 0 ;
    this.url = link?.url || "";
    this.expiresAt = link?.expiresAt
  }

  static create(link: Link | null) {
    return new LinkDTO(link);
  }
}



