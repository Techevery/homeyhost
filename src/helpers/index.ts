import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { error as logError } from "./logger";

export default class Helper {
  static signToken(payload:any):{token:string}{
    const token = jwt.sign(payload, (<any>process.env).APP_KEY,{
      expiresIn:"7d",
    });

    return {token};
  }

  static verifyToken(payload:any):any{
    try {
      const decodedToken = jwt.verify(payload, (<any>process.env).APP_KEY);

      if(typeof decodedToken === "object"){
        return decodedToken;
      }

      throw new Error("Invalid Tolen Format, expected an object")
    } catch (error) {
      if(error instanceof Error){
        logError({
          message:"Token verification failed",
          params:{
            name:error.name,
            message:error.message,
            stack:error.stack
          }
        })
      }

      throw new Error("Token verification failed")
    }
  };

  static hash(value:string, saltValue = 10){
    const hashedPassword = bcrypt.hashSync(value, saltValue);
    return hashedPassword
  };

  static correctPassword(inputPassword:string, userPassword:string){
    const isMatch = bcrypt.compareSync(inputPassword, userPassword);
    return isMatch;
  }
}