// address modules
import BranchModule from './address/branch/index.js'
import StateModule from './address/state/index.js'
import RegionModule from './address/region/index.js'
import NeighborhoodModule from './address/neighborhood/index.js'
import StreetModule from './address/street/index.js'
// import AreaModule from './address/area/index.js'


export default {
	typeDefs: [
  		BranchModule.typeDefs,
  		// AreaModule.typeDefs,
  		StateModule.typeDefs,
  		RegionModule.typeDefs,
  		NeighborhoodModule.typeDefs,
  		StreetModule.typeDefs,
	],
	resolvers: [
  		BranchModule.resolvers,
  		// AreaModule.resolvers,
  		StateModule.resolvers,
  		RegionModule.resolvers,
  		NeighborhoodModule.resolvers,
  		StreetModule.resolvers,
	]
}
