import { SignUpAuth } from "../middlewares/validators";
import { User } from "../models/index";
import { clerkAuthClient } from "../config/clerk/clerkclient";

export const createUser = async(authData: SignUpAuth) => {
    const user = await clerkAuthClient.users.createUser({
        emailAddress: [authData.email],
        username: authData.username,
        password: authData.password

    })
    const [newuser, created] = await User.findOrCreate({
        where: {clerk_id: user.id},
        defaults: {
            clerk_id: user.id,
            email: user.emailAddresses[0],
            username: user.username
        }
    })
    if(!created) return {newuser, created}

    return {newuser, createUser}

}

export const logOutUser = async(sessionId: string) => {
    await clerkAuthClient.sessions.revokeSession(sessionId)
   
}