import { Request, Response, NextFunction } from "express"

type RequestFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>

const asyncHandler = (requestFunc: RequestFunction) => {
    return (req: Request, res: Response, next: NextFunction) => Promise.resolve(requestFunc(req, res, next)).catch((err) => {
        return next(err)
    })
}

export default asyncHandler