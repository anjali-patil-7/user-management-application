const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode

    // If it's a multer error, it's a bad request
    if (err instanceof require("multer").MulterError) {
        statusCode = 400
    }

    // If we have a specific error message but status is 500, check if we should lower it
    if (err.message && statusCode === 500) {
        // Known user-facing errors
        if (err.message.includes("Only images are allowed") || err.message.includes("File too large")) {
            statusCode = 400
        }
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}
module.exports = errorHandler