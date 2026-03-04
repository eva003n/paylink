import { clerkClient } from "@clerk/express";
import { Auth } from "../middlewares/validators";

export const createUser = async(authData: Auth) => {
    const user = await clerkClient.users.createUser({
        emailAddress: [authData.email],
        password: authData.password,
    })

    return user

}