import productResolver from './product.resolver'

const productResolvers = {
  Query: {
    // ...productResolver.productResolver.Query
  },
  Mutation: {
    ...productResolver.productResolver.Mutation
  }
}

export { productResolvers }
