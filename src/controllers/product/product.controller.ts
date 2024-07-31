import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Product, ProductImage, ProductRating, ProductReview } from '../../db/models'
import { helperFunctionsUtils, responseHandlerUtils } from '../../utils'
import { Controller } from '../../types'
import { HttpError } from '../../libs'
import { httpErrorMessageConstant, httpStatusConstant, messageConstant } from '../../constants'
import { IAttributeOption } from '../../interfaces'

/**
 * @description  Creates a new product with provided details including name, description, price, category, and optional attributes.
 */
const addProduct: Controller = async (req: Request, res: Response) => {
  const { name, description, price, category, attributes } = req.body

  if (!name || !description || !price || !category || !attributes) {
    throw new HttpError(messageConstant.ERROR_ADD_PRODUCT, httpStatusConstant.BAD_REQUEST)
  }

  const newProduct = await Product.create({
    productId: helperFunctionsUtils.generateProductId(),
    name,
    description,
    price,
    category,
    attributes
  })

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: newProduct
  })
}

/**
 * @description Adds a new attribute to an existing product identified by productId.
 */
const addProductAttribute: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params
  const { name, options } = req.body

  if (!name || !options || !Array.isArray(options) || options.length === 0) {
    throw new HttpError(messageConstant.ERROR_ADD_ATTRIBUTE, httpStatusConstant.BAD_REQUEST)
  }

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const attributeExists = product.attributes.some((attr) => attr.name === name)
  if (attributeExists) {
    throw new HttpError(
      messageConstant.ATTRIBUTE_ALREADY_EXISTS,
      httpStatusConstant.REQUEST_CONFLICT
    )
  }

  const newAttribute = {
    name,
    options: options.map((option) => ({
      value: option.value,
      stock: option.stock
    }))
  }

  product.attributes.push(newAttribute)
  await product.save()

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: product.attributes
  })
}

/**
 * @description Adds new options to an existing attribute of a product identified by productId and attributeId.
 */
const addProductOptions: Controller = async (req: Request, res: Response) => {
  const { productId, attributeId } = req.params
  const { options } = req.body

  if (!options || !Array.isArray(options) || options.length === 0) {
    throw new HttpError(messageConstant.ERROR_ADD_OPTIONS, httpStatusConstant.BAD_REQUEST)
  }

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const attribute = (product.attributes as any).id(attributeId)
  if (!attribute) {
    throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  options.forEach((option) => {
    const optionExists = attribute.options.some(
      (existingOption: IAttributeOption) => existingOption.value === option.value
    )
    if (optionExists) {
      throw new HttpError(
        messageConstant.OPTION_ALREADY_EXISTS,
        httpStatusConstant.REQUEST_CONFLICT
      )
    }
    attribute.options.push({
      value: option.value,
      stock: option.stock
    })
  })

  await product.save()

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: attribute.options
  })
}

/**
 * @description Removes an attribute from a product identified by productId and attributeId.
 */
const removeProductAttribute: Controller = async (req: Request, res: Response) => {
  const { productId, attributeId } = req.params

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const attributeIndex = product.attributes.findIndex(
    (attr: any) => String(attr._id) === attributeId
  )
  if (attributeIndex === -1) {
    throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  product.attributes.splice(attributeIndex, 1)
  await product.save()

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: product.attributes
  })
}

/**
 * @description Removes options from an attribute of a product identified by productId, attributeId, and optionIds.
 */
const removeProductOptions: Controller = async (req: Request, res: Response) => {
  const { productId, attributeId } = req.params
  const { optionIds } = req.body

  if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
    throw new HttpError(httpErrorMessageConstant.VALIDATION_ERROR, httpStatusConstant.BAD_REQUEST)
  }

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const attribute = (product.attributes as any).id(attributeId)
  if (!attribute) {
    throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  optionIds.forEach((optionId) => {
    const optionIndex = attribute.options.findIndex((opt: any) => String(opt._id) === optionId)
    if (optionIndex !== -1) {
      attribute.options.splice(optionIndex, 1)
    }
  })

  await product.save()

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: attribute.options
  })
}

/**
 * @description Retrieves a list of all products with selected properties.
 */
const productsList: Controller = async (req: Request, res: Response) => {
  const products = await Product.find({ deletedAt: null }).select(
    'productId name description price category attributes'
  )
  if (!products) {
    throw new HttpError(
      messageConstant.ERROR_FETCHING_PRODUCTS,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }
  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.PRODUCTS_RETRIEVED_SUCCESSFULLY,
    data: products
  })
}

/**
 * @description Updates an existing product with provided details.
 */
const updateProduct: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params
  const { name, description, price, category } = req.body

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(productId), deletedAt: null },
    { $set: { name, description, price, category } },
    { new: true }
  )

  if (!updatedProduct) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: updatedProduct
  })
}

/**
 * @description Uploads a cover image for an existing product identified by productId.
 */
const uploadProductImage: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params

  const productExists = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!productExists) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  if (!req.file) {
    throw new HttpError(messageConstant.FILE_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const existingImage = await ProductImage.findOne({
    productId: productExists._id,
    imageName: 'coverImage',
    deletedAt: null
  })

  if (existingImage) {
    const updatedImage = await ProductImage.updateOne(
      {
        productId: productExists._id,
        imageName: 'coverImage'
      },
      {
        imagePath: req.file.path
      }
    )

    if (!updatedImage) {
      throw new HttpError(messageConstant.ERROR_UPLOAD_FILE, httpStatusConstant.BAD_REQUEST)
    }
  } else {
    const uploadedImage = await ProductImage.create({
      productId: productExists._id,
      imageName: 'coverImage',
      imagePath: req.file.path
    })

    if (!uploadedImage) {
      throw new HttpError(messageConstant.ERROR_UPLOAD_FILE, httpStatusConstant.BAD_REQUEST)
    }
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL
  })
}

/**
 * @description Retrieves a summary of reviews for a product including usernames of reviewers.
 */
const reviewsSummary: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params
  const { page = 1, pageSize = 10 } = req.query as unknown as { page: number; pageSize: number }
  const skip = (page - 1) * pageSize

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const reviews = await ProductReview.find({ productId: product._id, deletedAt: null })
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: 'userId',
      select: 'username'
    })
    .populate({ path: 'productId', select: 'productId name category' })

  if (!reviews.length) {
    throw new HttpError(messageConstant.NO_REVIEWS_FOUND, httpStatusConstant.NOT_FOUND)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    data: reviews
  })
}

/**
 * @description Retrieves a summary of ratings for a product including average rating and total number of ratings.
 */
const ratingsSummary: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const ratings = await ProductRating.aggregate([
    { $match: { productId: product._id, deletedAt: null } },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ])

  if (!ratings.length) {
    throw new HttpError(messageConstant.NO_RATINGS_FOUND, httpStatusConstant.NOT_FOUND)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    data: ratings[0]
  })
}

/**
 * @description Deactivates a product (soft delete).
 */
const deactivateProduct: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(productId) },
    { $set: { deletedAt: Date.now() } },
    { new: true }
  )

  if (!updatedProduct) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_PRODUCT,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.PRODUCT_DEACTIVATED_SOFT
  })
}

/**
 * @description Permanently removes a product.
 */
const deleteProductPermanently: Controller = async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId)
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const deletedProduct = await Product.deleteOne({ _id: ObjectId.createFromHexString(productId) })
  if (!deletedProduct) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_PRODUCT,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.PRODUCT_DELETED_HARD
  })
}

export default {
  addProduct,
  addProductAttribute,
  addProductOptions,
  removeProductAttribute,
  removeProductOptions,
  productsList,
  updateProduct,
  uploadProductImage,
  reviewsSummary,
  ratingsSummary,
  deactivateProduct,
  deleteProductPermanently
}
