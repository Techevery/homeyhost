import { Response } from "express";

class SuccessResponse {
  public sendSuccessResponse(
    res: Response,
    data: any,
    message: string,
    statusCode: number
  ) {
    if (res.headersSent) return;
    const finalStatusCode = statusCode !== undefined ? statusCode : 200;
    return res.status(finalStatusCode).json({
      status: "success",
      data,
      message,
      statusCode: finalStatusCode,
    });
  }
}

class ErrorResponse {
  public sendErrorResponse(
    res: Response,
    error: any,
    message: string,
    statusCode: number
  ) {
    if (res.headersSent) return;
    const finalstatusCode = statusCode !== undefined ? statusCode : 500;
    return res.status(finalstatusCode).json({
      status: "error",
      error,
      message,
      statusCode: finalstatusCode,
    });
  }
}
export { SuccessResponse, ErrorResponse };
