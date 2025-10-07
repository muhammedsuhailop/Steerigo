import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "@shared/types/Common";
import { ZodError } from "zod";

interface ValidationError {
  field: string;
  message: string;
}

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          errors: error.issues.map(
            (err): ValidationError => ({
              field: err.path.join("."),
              message: err.message,
            })
          ),
        };
        res.status(400).json(response);
      }
    }
  };
};
