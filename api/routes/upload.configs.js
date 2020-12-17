// MULTER HANDLES BODY FORMAT THAT BODY-PARSER DOES NOT SUPPORT
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // error, path
        callback(null, './uploads/')
    },
    filename: (req, file, callback) => {
        // error, path
        callback(null, new Date().toISOString() + file.originalname)
    },
})

const fileFilter = (req, file, callback) => {
    // LIMITS FILE TYPES UPLOAD
    file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ?
        callback(null, true) :
        callback(new Error('File mimetype not supported'), false)
}

exports.upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024},
    fileFilter,
})