export interface OptionInput {
  value: string
  stock: number
}

export interface ProductAttribute {
  _id?: string
  name: string
  options: OptionInput[]
}

export interface ProductInput {
  name: string
  description: string
  price: number
  category: string
  attributes: ProductAttribute[]
}
