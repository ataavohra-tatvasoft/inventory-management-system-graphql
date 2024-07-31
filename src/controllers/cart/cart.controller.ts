import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Cart, Product, User } from '../../db/models'
import { responseHandlerUtils } from '../../utils'
import { Controller } from '../../types'
import { httpErrorMessageConstant, httpStatusConstant, messageConstant } from '../../constants'
import { HttpError } from '../../libs'
import { IAttributeOption } from '../../interfaces'

/**
 * @description Adds a product to a user's cart, checking for stock availability.
 */
const addItemToNewCart: Controller = async (req: Request, res: Response) => {
  const { userId, productId, attributeId, optionId, quantity } = req.body

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const attribute = product.attributes.find((attr) => String(attr._id) === String(attributeId))
  if (!attribute) {
    throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const option = attribute.options.find((opt) => String(opt._id) === String(optionId))
  if (!option) {
    throw new HttpError(messageConstant.OPTION_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const user = await User.findOne({ _id: ObjectId.createFromHexString(userId), deletedAt: null })
  if (!user) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  if (quantity > option.stock) {
    throw new HttpError(messageConstant.PRODUCT_OUT_OF_STOCK, httpStatusConstant.BAD_REQUEST)
  }

  const cart = await Cart.create({
    userId: user._id,
    items: [{ productId, attributeId, optionId, quantity }]
  })

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: cart
  })
}

/**
 * @description Adds a product to a user's existing cart or updates its quantity if already present, checking for stock availability.
 */
const addItemToExistingCart: Controller = async (req: Request, res: Response) => {
  const { cartId, userId, productId, attributeId, optionId, quantity } = req.body

  const product = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!product) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const attribute = product.attributes.find((attr) => String(attr._id) === String(attributeId))
  if (!attribute) {
    throw new HttpError(messageConstant.ATTRIBUTE_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const option = attribute.options.find((opt) => String(opt._id) === String(optionId))
  if (!option) {
    throw new HttpError(messageConstant.OPTION_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const user = await User.findOne({ _id: ObjectId.createFromHexString(userId), deletedAt: null })
  if (!user) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  if (quantity > option.stock) {
    throw new HttpError(messageConstant.PRODUCT_OUT_OF_STOCK, httpStatusConstant.BAD_REQUEST)
  }

  const cart = await Cart.findOne({ _id: ObjectId.createFromHexString(cartId), userId: user._id })
  if (!cart) {
    throw new HttpError(messageConstant.CART_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      String(item.productId) === String(product._id) &&
      String(item.attributeId) === String(attributeId) &&
      String(item.optionId) === String(optionId)
  )

  if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + quantity
    if (newQuantity > option.stock) {
      throw new HttpError(messageConstant.PRODUCT_OUT_OF_STOCK, httpStatusConstant.BAD_REQUEST)
    }
    cart.items[itemIndex].quantity = newQuantity
  } else {
    cart.items.push({ productId, attributeId, optionId, quantity })
  }

  await cart.save()

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: cart
  })
}

/**
 * @description Removes a product from a user's cart.
 */
const removeItemFromCart: Controller = async (req: Request, res: Response) => {
  const { cartId, userId, productId, attributeId, optionId } = req.body

  const userExists = await User.findOne({
    _id: ObjectId.createFromHexString(userId),
    deletedAt: null
  })
  if (!userExists) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const productExists = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!productExists) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const cart = await Cart.findOne({
    _id: ObjectId.createFromHexString(cartId),
    userId: userExists._id
  })
  if (!cart) {
    throw new HttpError(messageConstant.CART_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      String(item.productId) === String(productExists._id) &&
      String(item.attributeId) === String(attributeId) &&
      String(item.optionId) === String(optionId)
  )
  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1)
    await cart.save()
  } else {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND_IN_CART, httpStatusConstant.NOT_FOUND)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: cart
  })
}

/**
 * @description Gets product details from a user's cart
 */
const getCartItems: Controller = async (req: Request, res: Response) => {
  const { cartId, userId } = req.params

  const user = await User.findOne({
    _id: ObjectId.createFromHexString(userId),
    deletedAt: null
  })
  if (!user) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const cart = await Cart.findOne({
    _id: ObjectId.createFromHexString(cartId),
    userId: user._id
  }).populate({
    path: 'items.productId',
    select: '_id productId name description price category attributes deletedAt'
  })
  if (!cart) {
    throw new HttpError(messageConstant.CART_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const cartItems = await Promise.all(
    cart.items.map(async (item: any) => {
      const product = item.productId as any
      const attributeId = item.attributeId
      const optionId = item.optionId

      const attribute = product.attributes.find(
        (attr: IAttributeOption) => String(attr._id) === String(attributeId)
      )

      if (attribute) {
        attribute.options = attribute.options.filter(
          (opt: any) => String(opt._id) === String(optionId)
        )
      }

      const itemObject = item.toObject()
      return {
        ...itemObject,
        productId: {
          _id: product._id,
          productId: product.productId,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          attributes: attribute ? [attribute] : []
        }
      }
    })
  )

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: cartItems
  })
}

/**
 * @description Deactivates a cart (soft delete).
 */
const deactivateCart: Controller = async (req: Request, res: Response) => {
  const { cartId } = req.params

  const cart = await Cart.findOne({ _id: ObjectId.createFromHexString(cartId) })
  if (!cart) {
    throw new HttpError(messageConstant.CART_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(cartId) },
    { $set: { deletedAt: Date.now() } },
    { new: true }
  )

  if (!updatedCart) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_CART,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.CART_DEACTIVATED_SOFT
  })
}

/**
 * @description Permanently removes a cart.
 */
const deleteCartPermanently: Controller = async (req: Request, res: Response) => {
  const { cartId } = req.params

  const deletedCart = await Cart.deleteOne({ _id: ObjectId.createFromHexString(cartId) })
  if (!deletedCart) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_CART,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.CART_DELETED_HARD
  })
}

export default {
  addItemToNewCart,
  addItemToExistingCart,
  removeItemFromCart,
  getCartItems,
  deactivateCart,
  deleteCartPermanently
}
