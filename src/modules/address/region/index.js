import { gql } from 'apollo-server-express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const file = fs.readFileSync( path.join(__dirname, 'schema.gql'), 'UTF-8' )

const typeDefs = gql`${file}`
import resolvers from './resolver.js'

export default {
	typeDefs,
	resolvers
}