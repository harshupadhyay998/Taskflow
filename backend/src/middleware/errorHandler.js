const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode

    if (err.name === "CastError" && err.kind === "objectId") {
        statusCode = 404;
        message: "Resources not found"
    }

    if (err.name === "validationError") {
        statusCode = 400
        message: object.values(err.errors)
            .map((e) => e.message)
            .json(",");
    }

    if (err.code === 11000) {
        statusCode = 400;
        message: "Duplicate email entered"
    }

}

export default errorHandler;