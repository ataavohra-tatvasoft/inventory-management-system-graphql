import { Express } from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import { httpStatusConstant, messageConstant } from '../constants'
import { HttpError } from '../libs'

const productUploadDirectory = path.join('public', 'uploads', 'product')

const getUploadDirectory = (url: string): string => {
  if (url.includes('/upload/coverimage')) {
    return productUploadDirectory
  } else {
    throw new HttpError(messageConstant.INVALID_UPLOAD_ROUTE, httpStatusConstant.BAD_REQUEST)
  }
}

const generateUniqueFileName = (
  url: string,
  params: { productId: string },
  file: Express.Multer.File
): string => {
  const extension = file.originalname.split('.').pop()
  const baseFileName = file.fieldname
  let uniqueName: string

  if (url.includes('/upload/coverimage')) {
    uniqueName = `productId-${params.productId}-coverImage.${extension}`
  } else {
    uniqueName = `${baseFileName}.${extension}`
  }

  return uniqueName
}

const deleteExistingCoverPhoto = async (directory: string, productId: string) => {
  const files: string[] = await fs.readdir(directory)
  const coverPhotos: string[] = files.filter((file: string) =>
    file.startsWith(`productId-${String(productId)}-coverImage.`)
  )

  for (const photo of coverPhotos) {
    const filePath = path.join(directory, photo)
    await fs.unlink(filePath)
  }
}

export default {
  getUploadDirectory,
  generateUniqueFileName,
  deleteExistingCoverPhoto
}
