import { Joi } from 'celebrate'

const addItemToNewCartValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    attributeId: Joi.string().required(),
    optionId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
  })
}

const addItemToExistingCartValidation = {
  body: Joi.object().keys({
    cartId: Joi.string().required(),
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    attributeId: Joi.string().required(),
    optionId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
  })
}

const removeItemFromCartValidation = {
  body: Joi.object().keys({
    cartId: Joi.string().required(),
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    attributeId: Joi.string().required(),
    optionId: Joi.string().required()
  })
}

const getCartItemsValidation = {
  params: Joi.object().keys({
    cartId: Joi.string().required(),
    userId: Joi.string().required()
  })
}

const deleteCartValidation = {
  params: Joi.object().keys({
    cartId: Joi.string().required()
  })
}

export default {
  addItemToNewCartValidation,
  addItemToExistingCartValidation,
  removeItemFromCartValidation,
  getCartItemsValidation,
  deleteCartValidation
}
