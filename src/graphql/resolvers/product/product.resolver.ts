// import { GraphQLUpload } from 'graphql-upload'
// import { FileUpload } from 'graphql-upload'
import { HttpError } from '../../../libs'
import { Product, ProductReview, ProductRating } from '../../../db/models'
import { messageConstant, httpStatusConstant, httpErrorMessageConstant } from '../../../constants'
import { ProductInput, OptionInput, PaginationInput } from '../../types'
import { helperFunctionsUtils } from '../../../utils'

const productResolver = {
  // Upload: GraphQLUpload,
  Query: {
    products: async (_: any, { pagination }: { pagination: PaginationInput }) => {
      const { page = 1, pageSize = 10 } = pagination
      console.log(pagination)
      const skip = (Number(page) - 1) * Number(pageSize)

      const totalProductsCount = await Product.countDocuments({ deletedAt: null })
      console.log(totalProductsCount)
      const totalPages = Math.ceil(totalProductsCount / Number(pageSize))
      if (Number(page) > Number(totalPages)) {
        throw new HttpError(messageConstant.INVALID_PAGE_NUMBER, httpStatusConstant.BAD_REQUEST)
      }

      const products = await Product.find({ deletedAt: null }).skip(skip).limit(Number(pageSize))

      if (!products.length) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        products,
        pagination: {
          page,
          pageSize,
          totalPages
        }
      }
    },
    product: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id)
    },
    reviewsSummary: async (
      _: any,
      {
        productId,
        page = 1,
        pageSize = 10
      }: {
        productId: string
        page: number
        pageSize: number
      }
    ) => {
      const skip = (page - 1) * pageSize

      const product = await Product.findById(productId)
      if (!product) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      const reviews = await ProductReview.find({ productId: product._id, deletedAt: null })
        .skip(skip)
        .limit(pageSize)
        .populate({ path: 'userId', select: 'username' })

      if (!reviews.length) {
        throw new HttpError(messageConstant.NO_REVIEWS_FOUND, httpStatusConstant.NOT_FOUND)
      }

      return reviews
    },
    ratingsSummary: async (_: any, { productId }: { productId: string }) => {
      const product = await Product.findById(productId)
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

      return ratings[0]
    }
  },
  Mutation: {
    addProduct: async (_: any, { productInput }: { productInput: ProductInput }) => {
      const { name, description, price, category, attributes } = productInput

      const newProduct = await Product.create({
        productId: helperFunctionsUtils.generateProductId(),
        name,
        description,
        price,
        category,
        attributes
      })

      if (!newProduct) {
        throw new HttpError(
          messageConstant.ERROR_ADD_PRODUCT,
          httpStatusConstant.INTERNAL_SERVER_ERROR
        )
      }

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: newProduct._id
      }
    },
    addProductAttribute: async (
      _: any,
      {
        productId,
        name,
        options
      }: {
        productId: string
        name: string
        options: OptionInput[]
      }
    ) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      const attributeExists = product.attributes.some((attr: any) => attr.name === name)
      if (attributeExists) {
        throw new HttpError(
          messageConstant.ATTRIBUTE_ALREADY_EXISTS,
          httpStatusConstant.REQUEST_CONFLICT
        )
      }

      const newAttribute = {
        name,
        options: options.map((option) => ({ value: option.value, stock: option.stock }))
      }
      product.attributes.push(newAttribute)
      await product.save()

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: product._id
      }
    },
    addProductOptions: async (
      _: any,
      {
        productId,
        attributeId,
        options
      }: {
        productId: string
        attributeId: string
        options: OptionInput[]
      }
    ) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      const attribute = product.attributes.find((attr: any) => String(attr._id) === attributeId)
      if (!attribute) {
        throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      options.forEach((option) => {
        const optionExists = attribute.options.some(
          (existingOption: any) => existingOption.value === option.value
        )
        if (optionExists) {
          throw new HttpError(
            messageConstant.OPTION_ALREADY_EXISTS,
            httpStatusConstant.REQUEST_CONFLICT
          )
        }
        attribute.options.push({ value: option.value, stock: option.stock })
      })

      await product.save()

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: product._id
      }
    },
    removeProductAttribute: async (
      _: any,
      {
        productId,
        attributeId
      }: {
        productId: string
        attributeId: string
      }
    ) => {
      const product = await Product.findById(productId)
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

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: product._id
      }
    },
    removeProductOptions: async (
      _: any,
      {
        productId,
        attributeId,
        optionIds
      }: {
        productId: string
        attributeId: string
        optionIds: string[]
      }
    ) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      const attribute = product.attributes.find((attr: any) => String(attr._id) === attributeId)
      if (!attribute) {
        throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      const optionsToRemove = optionIds.map((id) => String(id))
      attribute.options = attribute.options.filter(
        (option: any) => !optionsToRemove.includes(String(option._id))
      )
      await product.save()

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: product._id
      }
    },
    // uploadProductImage: async (_: any,{
    //   productId,
    //   file
    // }: {
    //   productId: string
    //   file: Promise<FileUpload>
    // }) => {
    //   const { createReadStream, filename } = await file

    //   const product = await Product.findById(productId)
    //   if (!product) {
    //     throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
    //   }

    //   const filePath = `/uploads/${filename}`
    //   const stream = createReadStream()
    //   const out = require('fs').createWriteStream(filePath)
    //   stream.pipe(out)
    //   await new Promise((resolve, reject) => {
    //     out.on('finish', resolve)
    //     out.on('error', reject)
    //   })

    //   const existingImage = await ProductImage.findOne({
    //     productId: product._id,
    //     imageName: 'coverImage',
    //     deletedAt: null
    //   })

    //   if (existingImage) {
    //     existingImage.imagePath = filePath
    //     await existingImage.save()
    //   } else {
    //     const uploadedImage = new ProductImage({
    //       productId: product._id,
    //       imageName: 'coverImage',
    //       imagePath: filePath
    //     })
    //     await uploadedImage.save()
    //   }

    //   return {
    //     statusCode: httpStatusConstant.OK,
    //     message: httpErrorMessageConstant.SUCCESSFUL,
    //     id: product._id
    //   }
    // },
    deactivateProduct: async (_: any, { productId }: { productId: string }) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      product.deletedAt = new Date()
      await product.save()

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: product._id
      }
    },
    deleteProductPermanently: async (_: any, { productId }: { productId: string }) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
      }

      await Product.deleteOne({ _id: productId })

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: productId
      }
    }
  }
}
export default { productResolver }
