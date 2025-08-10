export const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({success: false, message});
}

export const sendSuccess = (res, statusCode, data) => {
    return res.status(statusCode).json({success: true, data});
}