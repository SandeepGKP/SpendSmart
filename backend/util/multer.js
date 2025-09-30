const multer = require('multer')
const { root } = require('../util/path')
const path = require('path')


const storage = multer.memoryStorage();

const upload = multer({ storage });


exports.storage = storage;
exports.upload = upload;
