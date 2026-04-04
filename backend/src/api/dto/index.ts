import { Merchant } from "src/models";

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



