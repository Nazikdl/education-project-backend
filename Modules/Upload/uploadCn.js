import { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../../app.js";
import fs from 'fs'
export const singleUpload = catchAsync(async (req, res, next) => {
    const file = req.file
    if (!file) {
        return new HandleERROR('upload filed', 400)
    }
    return res.status(200).json({
        success: true,
        data: file.filename,
        message: 'upload file successfully'

    })
})
export const multiUpload = catchAsync(async (req, res, next) => {
    const files = req.files
    if (!files) {
        return new HandleERROR('upload filed', 400)
    }
    return res.status(200).json({
        success: true,
        message: 'upload files successfully',
        data: files?.map(item => item.filename)
    })

})
export const removeSingleFile = catchAsync(async (req, res, next) => {
    const { filename } = req.body
    if (!filename) {
        return new HandleERROR('filename is required', 400)
    }
    const removePath = `${__dirname}/Public/${filename.split('/').at(-1)}`
    if (fs.existsSync(removePath)) {
        fs.unlinkSync(removePath)
    }
    return res.status(200).json({
        success: true,
        message: 'remove file successfully'
    })
})
export const removeMultiFiles = catchAsync(async (req, res, next) => {
    const { filenames } = req.body
    for (let filename of filenames) {
        const removePath = `${__dirname}/Public/${filename.split('/').at(-1)}`
        if (fs.existsSync(removePath)) {
            fs.unlinkSync(removePath)
       }
    }
    return res.status(200).json({
        success: true,
        message: 'remove files successfully'
    })
})