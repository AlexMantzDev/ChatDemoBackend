import { Request } from "express";

interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: number;
    username: string;
    color: string;
  };
}

export default IGetUserAuthInfoRequest;
