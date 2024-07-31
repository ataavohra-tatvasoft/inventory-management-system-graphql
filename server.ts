import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
// import { graphqlUploadExpress } from 'graphql-upload'
import { dbConfig, envConfig, graphqlConfig } from './src/configs'
import { messageConstant } from './src/constants'
import { loggerUtils } from './src/utils'

/**
 * Function to create and configure the Express app.
 */
const createServer = async (): Promise<Application> => {
  try {
    const app: Application = express()

    // Middleware setup
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())

    // Use graphqlUploadExpress middleware in your Express app setup
    // app.use(graphqlUploadExpress())

    // Routes setup
    // app.use(routes);

    // Error handling middleware
    // app.use(errorHandlerUtils.errorHandler);

    return app
  } catch (error) {
    loggerUtils.logger.error('Error creating server: ', error)
    throw error
  }
}

/**
 * Function to start the Express server.
 */
const startServer = async (app: any): Promise<void> => {
  try {
    await dbConfig.connectToDatabase()
    loggerUtils.logger.info(messageConstant.APP_STARTED)

    const server = app.listen(envConfig.serverPort, () => {
      loggerUtils.logger.info(`Server started on port ${envConfig.serverPort}`)
    })

    const apolloServer = graphqlConfig.createApolloServer(server)

    await apolloServer.start()

    apolloServer.applyMiddleware({ app })
  } catch (error) {
    loggerUtils.logger.error('Error starting server: ', error)
    throw error
  }
}

export { createServer, startServer }
