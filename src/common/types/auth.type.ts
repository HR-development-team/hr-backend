import { TokenPayload } from "@common/utils/jwt.js";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
