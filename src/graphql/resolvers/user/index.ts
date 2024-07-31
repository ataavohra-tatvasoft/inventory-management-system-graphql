import userResolver from './user.resolver'
import productResolver from './product.resolver'

const userResolvers = {
  Query: {
    ...userResolver.userResolver.Query
  },
  Mutation: {
    ...userResolver.userResolver.Mutation,
    ...productResolver.productResolver.Mutation
  }
}

export { userResolvers }
