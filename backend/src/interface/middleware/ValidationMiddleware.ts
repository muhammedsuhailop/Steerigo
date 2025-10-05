import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "@shared/types/Common";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        errors: error.errors?.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
      res.status(400).json(response);
    }
  };
};
