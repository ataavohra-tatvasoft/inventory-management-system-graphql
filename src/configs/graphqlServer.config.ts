import { ApolloServer } from 'apollo-server-express'
import { Server } from 'http'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { mergeResolvers } from '@graphql-tools/merge'
import { productTypeDefs, userTypeDefs } from '../graphql/schemas'
import { userResolvers, productResolvers } from '../graphql/resolvers'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'

const createApolloServer = (server: Server): ApolloServer => {
  const typeDefs = mergeTypeDefs([productTypeDefs, userTypeDefs])
  const resolvers = mergeResolvers([productResolvers, userResolvers])

  return new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
    context: ({ req }) => ({ req })
  })
}

export default { createApolloServer }
