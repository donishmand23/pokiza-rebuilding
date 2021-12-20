import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import http from 'http'
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
    
    const server = new ApolloServer({
        schema,
        introspection: true,
        playground: true,
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
})()