/* eslint-disable no-useless-escape */
import { Joi } from 'celebrate'

const addUserValidation = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string()
      .min(5)
      .optional()
      .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=?{|}\[\]:\'\";,.<>\/\\|\s]).+$/)
      .allow(null)
  })
}

const getActiveUsersListValidation = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).optional().default(1),
    pageSize: Joi.number().integer().min(1).optional().default(10)
  })
}

const deactivateUserValidation = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
}

const deleteUserPermanentlyValidation = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
}

export default {
  addUserValidation,
  getActiveUsersListValidation,
  deactivateUserValidation,
  deleteUserPermanentlyValidation
}
