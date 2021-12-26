import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer
} from 'apollo-server-core'
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

    app.use('/data/uploads', express.static( path.join(process.cwd(), 'uploads') ))
    
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




/*
    Plan
    1. clients (filter, sort, pagination)
    2. staffs (filter, sort, pagination)
    3. deleteClient
        * if not have orders
    4. deleteStaff
        * if not have registered cars and orders to receive or deliver
        * if not an accountant and have money on account
    6. sendMessage to users
    7. sockets
    

    USER MODULE work flow
        0. UserData Structure for clients and staffs
        1. mock data (clients)
        2. query clients 
        3. filter clients ( age(two values), gender, status[multiple], socialSet[multiple], branch[multiple], clientId, address )
        4. sort clients (age, status, clientId, firstName)
        5. search clients (firstName, lastName, mainContact, secondContact, summary)
        6. paginate clients(the number of elements in the array)
    
    Client data structure {
        clientId
        clientStatus
        clientSummary
        clientFrom
        clientCreatedAt
        clientInfo {
            userId
            fullName
            firstName
            lastName
            age
            gender
            branch
            address
        }
    }
*/