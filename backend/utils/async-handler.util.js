const asyncHandler = (handlerFn) => {
    return (req, res, next) => {
        Promise.resolve(handlerFn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;
