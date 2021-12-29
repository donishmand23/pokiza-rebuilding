import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload'
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

    app.use(graphqlUploadExpress({ maxFileSize: 8 * 1024 * 1024, maxFiles: 1 }))
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
    6. changeClient(userInfo - contact(check), address(branch), )
    5. changeStaff( userInfo, address(not branch), branch, img )
    6. sendMessage to users
    7. sockets
   

    addClient(userInfo, address)
    enterClientPhone(contact { 3 min })
    enterClientPassword
    registerClient
    checkPhoneNumber (contact)



    orderlar chiqarilayotganda ular tegishli bolgan user o'chirilgan yoki
    yo'qligi tekshirilsin
*/