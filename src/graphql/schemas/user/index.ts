import { gql } from 'apollo-server-express'
import userSchemas from './user.schema'
import productSchemas from './product.schema'

const userTypeDefs = gql`
  ${userSchemas.userSchema},
  ${productSchemas.productSchema}
`

export { userTypeDefs }
