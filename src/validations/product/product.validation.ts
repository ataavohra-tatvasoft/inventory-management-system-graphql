import { Joi } from 'celebrate'

const addProductValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    attributes: Joi.array().items(Joi.object())
  })
}

const addProductAttributeValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    options: Joi.array()
      .items(
        Joi.object({
          value: Joi.string().required(),
          stock: Joi.number().required()
        })
      )
      .required()
  })
}

const addProductOptionsValidation = {
  body: Joi.object({
    options: Joi.array()
      .items(
        Joi.object({
          value: Joi.string().required(),
          stock: Joi.number().required()
        })
      )
      .required()
  }),
  params: Joi.object({
    productId: Joi.string().required(),
    attributeId: Joi.string().required()
  })
}

const removeProductAttributeValidation = {
  params: Joi.object({
    productId: Joi.string().required(),
    attributeId: Joi.string().required()
  })
}

const removeProductOptionsValidation = {
  body: Joi.object({
    optionIds: Joi.array().items(Joi.string().required()).required()
  }),
  params: Joi.object({
    productId: Joi.string().required(),
    attributeId: Joi.string().required()
  })
}

const updateProductValidation = {
  params: Joi.object().keys({
    productId: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    category: Joi.string().optional()
  })
}

const uploadProductImageValidation = {
  params: Joi.object().keys({
    productId: Joi.string().required()
  })
}

const reviewsSummaryValidation = {
  params: Joi.object().keys({
    productId: Joi.string().required()
  }),
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(10)
  })
}

const ratingsSummaryValidation = {
  params: Joi.object().keys({
    productId: Joi.string().required()
  })
}

const deleteProductValidation = {
  params: Joi.object().keys({
    productId: Joi.string().required()
  })
}

export default {
  addProductValidation,
  addProductAttributeValidation,
  addProductOptionsValidation,
  removeProductAttributeValidation,
  removeProductOptionsValidation,
  updateProductValidation,
  uploadProductImageValidation,
  reviewsSummaryValidation,
  ratingsSummaryValidation,
  deleteProductValidation
}
