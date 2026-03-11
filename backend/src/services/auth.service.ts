import { SignInAuth, SignUpAuth } from "../middlewares/validators";
import { User } from "../models/index";

export const createUser = async(authData: SignUpAuth) => {

    const [newuser, created] = await User.findOrCreate({
        where: {email: authData.email},
        defaults: {
            email: authData.email,
            username: authData.username,
            password: authData.password
        }
    })
    if(!created) return {newuser, created}

    return {newuser, createUser}

}

export const logInUser = async(authData: SignInAuth) => {

}

export const logOutUser = async(sessionId: string) => {
   
}