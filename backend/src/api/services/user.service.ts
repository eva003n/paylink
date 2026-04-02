import { Merchant } from "src/models";
import { Id } from "src/schemas/validators";

export const fetchUser = async(id: Id) => {
    const merchant = await Merchant.findByPk(id)

    return merchant

}