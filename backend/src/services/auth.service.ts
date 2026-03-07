import { Auth } from "../middlewares/validators";
import { User } from "../models/index";

export const createUser = async(authData: Auth) => {
    const [newuser, isUser] = await User.findOrCreate({
        where: {clerk_id: authData.data.id},
        defaults: {
            clerk_id: authData.data.id
        }
    })
    if(isUser) return 

    return newuser

}