console.clear()
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer
} from 'apollo-server-core'
import context from './context.js'
import express from 'express'
import http from 'http'
import path from 'path'
import { PORT } from '#config'


// loading modules
import modules from '#modules/index.js'
import graphqlTypes from './graphq-types/index.js'

// making an executable schema
const schema = makeExecutableSchema({
    typeDefs: [graphqlTypes.typeDefs, ...modules.typeDefs],
    resolvers: [graphqlTypes.resolvers, ...modules.resolvers],
})

;(async () => {
    const app = express()
    const httpServer = http.createServer(app)

    app.use(graphqlUploadExpress({ maxFileSize: 8 * 1024 * 1024, maxFiles: 1 }))
    app.use('/data/uploads', express.static(path.join(process.cwd(), 'uploads')))
    
    const server = new ApolloServer({
        schema,
        introspection: true,
        playground: true,
        context: context,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ],
    })

    await server.start()

    server.applyMiddleware({
        app,
        path: '/graphql',
    })

    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Server ready at http://127.0.0.1:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Server ready at http://172.28.64.1:${PORT}${server.graphqlPath}`)
})()
