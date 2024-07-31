import { Model, model, Schema } from 'mongoose'
import { IProduct, IProductAttribute, IAttributeOption } from '../../interfaces'

type ProductModel = Model<IProduct>

const attributeOptionSchema: Schema<IAttributeOption> = new Schema<IAttributeOption>({
  value: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
})

const productAttributeSchema: Schema<IProductAttribute> = new Schema<IProductAttribute>({
  name: {
    type: String,
    required: true
  },
  options: {
    type: [attributeOptionSchema],
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
})

const productSchema: Schema<IProduct, ProductModel> = new Schema<IProduct, ProductModel>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      maxlength: 22
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    attributes: {
      type: [productAttributeSchema],
      required: true,
      validate: {
        validator: function (attributes: IProductAttribute[]) {
          const attributeNames = attributes.map((attr) => attr.name)
          return attributeNames.length === new Set(attributeNames).size
        },
        message: 'Attributes names should be unique within a product.'
      }
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

export const Product: ProductModel = model<IProduct, ProductModel>('products', productSchema)
