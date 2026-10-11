
const notFound = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found!`,
    });
};

export { notFound };

