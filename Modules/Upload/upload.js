import uploadOption from "../../Utils/uploadOption.js";
import { Router } from "express";
import { multiUpload, removeMultiFiles, removeSingleFile, singleUpload } from "./uploadCn.js";
const uploadRouter = Router()
uploadRouter.route('/')
    .post(uploadOption.single('file'), singleUpload)
    .delete(removeSingleFile)
uploadRouter.route('/multi')
    .post(uploadOption.array('files', 10), multiUpload)
    .delete(removeMultiFiles)
export default uploadRouter