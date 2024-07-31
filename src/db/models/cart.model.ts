import { Model, model, Schema } from 'mongoose'
import { ICart } from '../../interfaces'

type CartModel = Model<ICart>
const cartSchema: Schema<ICart, CartModel> = new Schema<ICart, CartModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true
        },
        attributeId: {
          type: Schema.Types.ObjectId,
          ref: 'productAttributes',
          required: true
        },
        optionId: {
          type: Schema.Types.ObjectId,
          ref: 'attributeOptions',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export const Cart: CartModel = model<ICart, CartModel>('carts', cartSchema)
