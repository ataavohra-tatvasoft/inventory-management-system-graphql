import { Model, model, Schema } from 'mongoose'
import { IProductReview } from '../../interfaces'

type ProductReviewModel = Model<IProductReview>
const productReviewSchema: Schema<IProductReview, ProductReviewModel> = new Schema<
  IProductReview,
  ProductReviewModel
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
    review: {
      type: String,
      required: true
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
productReviewSchema.index({ productId: 1, userId: 1 }, { unique: true })

export const ProductReview: ProductReviewModel = model<IProductReview, ProductReviewModel>(
  'productReviews',
  productReviewSchema
)
