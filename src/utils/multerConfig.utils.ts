import multer, { StorageEngine } from 'multer'
import { Request } from 'express'
import multerUtils from './multer.utils'

const fileStorage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDirectory = multerUtils.getUploadDirectory(req.url)
      cb(null, uploadDirectory)
    } catch (error) {
      cb(error as Error, '')
    }
  },
  filename: async (req: Request<{ productId: string }>, file, cb) => {
    try {
      const uniqueName = multerUtils.generateUniqueFileName(req.url, req.params, file)
      const uploadDirectory = multerUtils.getUploadDirectory(req.url)
      let finalFileName = uniqueName

      if (req.url.includes('/upload/coverimage')) {
        await multerUtils.deleteExistingCoverPhoto(uploadDirectory, req.params.productId)
        finalFileName = `productId-${req.params.productId}-coverImage.${file.originalname.split('.').pop()}`
      }

      cb(null, finalFileName)
    } catch (error) {
      cb(error as Error, '')
    }
  }
})

const fileFilter = (req: Request, file: any, cb: any) => {
  const allowedImageTypes = ['image/png', 'image/jpg', 'image/jpeg']
  const allowedDocumentTypes = ['application/pdf']
  const isImage = allowedImageTypes.includes(file.mimetype)
  const isDocument = allowedDocumentTypes.includes(file.mimetype)

  if (isImage || isDocument) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2000000 } // 2MB limit
})

export default {
  upload
}
