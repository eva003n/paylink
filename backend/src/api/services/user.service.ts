import { Merchant } from "../models";
import { Id } from "../../schemas/validators";
import { UserDTO } from "../dto";

export const fetchUser = async(id: Id) => {
    const merchant = await Merchant.findByPk(id)

    return UserDTO.create(merchant)

}