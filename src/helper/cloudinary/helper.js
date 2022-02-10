const cloudinary = require('../../config/cloudinary')
export async function uploader(path) { return await cloudinary.updoads(path, "samples"); }