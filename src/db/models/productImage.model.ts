import { Model, model, Schema } from 'mongoose'
import { IProductImage } from '../../interfaces'

type ProductImageModel = Model<IProductImage>
const productImageSchema: Schema<IProductImage, ProductImageModel> = new Schema<
  IProductImage,
  ProductImageModel
>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true,
      unique: true
    },
    imagePath: {
      type: String,
      required: true
    },
    imageName: {
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

export const ProductImage: ProductImageModel = model<IProductImage, ProductImageModel>(
  'productImages',
  productImageSchema
)
