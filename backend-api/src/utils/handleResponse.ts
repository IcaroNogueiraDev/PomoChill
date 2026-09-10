import type { Response } from "express"

const handleError = (res: Response, statusCode: number, message: string, data: any = null): void => {

    res.status(statusCode).json({
        success: false,
        message,
        data
    })

}

const handleSuccess = (res: Response, statusCode: number, message: string, data: any = null): void => {

    res.status(statusCode).json({
        success: true,
        message,
        data
    })

}

export { handleError, handleSuccess }