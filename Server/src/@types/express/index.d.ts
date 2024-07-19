import { Request, Response } from "express";
import { UserSchemaInterface } from "../src/models/user.model";


export{}

declare global {
    namespace Express {
      export  interface Request {
            user?:UserSchemaInterface
    }
}
}
