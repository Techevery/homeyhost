import {Request, Response, NextFunction} from "express";
import HttpStatusCode from "../helpers/httpResponse";
import Helper from "../helpers";
import prisma from "../helpers/prisma";

export const authenticateAgent = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(HttpStatusCode.HTTP_BAD_REQUEST).json({message:"Authorization token is missing"});
    };

    const decodedToken = Helper.verifyToken(token);

    const agent = await prisma.agent.findUnique({
      where:{id:decodedToken?.id},
    });

    if(!agent){
      return res.status(HttpStatusCode.HTTP_UNAUTHORIZED).json({message:"UNAUTHORIZED ACCESS"})
    }

    (req as any).agent = agent;
  } catch (error) {
    return res.status(HttpStatusCode.HTTP_UNAUTHORIZED).json({message:"Authentication failed"})
  }
}