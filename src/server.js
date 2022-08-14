console.clear()
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlUploadExpress } from 'graphql-upload'
import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginInlineTrace
} from 'apollo-server-core'
import context from './context.js'
import { PORT } from '#config'
import express from 'express'
import https from 'https'
import path from 'path'
import fs from 'fs'
import './helpers/arrayMethods.js'

console.log(fs.readFileSync('/etc/letsencrypt/live/pokiza-gilam.uz/fullchain.pem'))

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/pokiza-gilam.uz/fullchain.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pokiza-gilam.uz/privkey.pem')
}

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
    const httpServer = https.createServer(options, app)

    app.use(graphqlUploadExpress({ maxFileSize: 8 * 1024 * 1024, maxFiles: 1 }))
    app.use('/data/uploads', express.static(path.join(process.cwd(), 'uploads')))
    
    const server = new ApolloServer({
        schema,
        introspection: true,
        playground: true,
        context: context,
        plugins: [
            ApolloServerPluginInlineTrace(),
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ],
    })

    await server.start()

    server.applyMiddleware({
        app,
        path: '/api/graphql',
    })

    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Server ready at http://127.0.0.1:${PORT}${server.graphqlPath}`)
})()