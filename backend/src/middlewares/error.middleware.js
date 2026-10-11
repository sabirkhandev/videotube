const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res
    .status(statusCode)
    .json(
        {
        success: err.success ?? false,
        statusCode: statusCode,
        message: message,
        data: err.data ?? null,
        errors: err.errors || [],
        }
    );
};

export { errorHandler };
