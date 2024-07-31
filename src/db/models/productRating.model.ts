import { Model, model, Schema } from 'mongoose'
import { IProductRating } from '../../interfaces'

type ProductRatingModel = Model<IProductRating>
const productRatingSchema: Schema<IProductRating, ProductRatingModel> = new Schema<
  IProductRating,
  ProductRatingModel
>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Create a compound unique index on productId and userId
productRatingSchema.index({ productId: 1, userId: 1 }, { unique: true })

export const ProductRating: ProductRatingModel = model<IProductRating, ProductRatingModel>(
  'productRatings',
  productRatingSchema
)
