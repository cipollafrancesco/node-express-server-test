exports.createResponse = (body, message, others) => {
    return {body, message, ...others}
}