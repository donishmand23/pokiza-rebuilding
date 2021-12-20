import BranchModule from './address/branch/index.js'
import StateModule from './address/state/index.js'

export default {
	typeDefs: [
  		BranchModule.typeDefs,
  		StateModule.typeDefs,
	],
	resolvers: [
  		BranchModule.resolvers,
  		StateModule.resolvers,
	]
}
