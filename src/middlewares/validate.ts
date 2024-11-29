import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import HttpStatusCode from "../helpers/httpResponse";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(HttpStatusCode.HTTP_BAD_REQUEST).json({
          message: "Validation failed",
          errors: error,
        });
      }

      next(error);
    }
  };
};
