import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../helpers/httpResponse";
import Helper from "../helpers";
import prisma from "../helpers/prisma";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res
        .status(HttpStatusCode.HTTP_UNAUTHORIZED)
        .json({ message: "Authentication token is missing." });
    }

    const decodedToken = Helper.verifyToken(token);

    const admin = await prisma.admin.findUnique({
      where: { id: decodedToken?.id },
    });

    if (!admin) {
      res
        .status(HttpStatusCode.HTTP_UNAUTHORIZED)
        .json({ message: "Unauthorized access." });
    }

    (req as any).admin = admin;

    next();
  } catch (error) {
    return next(error);
  }
};
