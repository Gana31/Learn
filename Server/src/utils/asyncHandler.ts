import {  Request, Response, NextFunction } from "express"

interface func <T> {
    (req: Request, res: Response, next: NextFunction) : Promise<T>
}

const asyncHandler = <T>(reqestHandler: func<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(reqestHandler(req, res, next)).catch((e) => next(e))
    }
}
export { asyncHandler }
