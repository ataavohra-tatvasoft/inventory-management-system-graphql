import { gql } from 'apollo-server-express'
import productSchemas from './product.schema'

const productTypeDefs = gql`
  ${productSchemas.productSchema}
`

export { productTypeDefs }
