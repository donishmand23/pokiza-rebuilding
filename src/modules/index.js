// address modules
import BranchModule from './address/branch/index.js'
import StateModule from './address/state/index.js'
import RegionModule from './address/region/index.js'
import NeighborhoodModule from './address/neighborhood/index.js'
import StreetModule from './address/street/index.js'
import AreaModule from './address/area/index.js'
import AddressModule from './address/address/index.js'


export default {
	typeDefs: [
  		BranchModule.typeDefs,
  		StateModule.typeDefs,
  		RegionModule.typeDefs,
  		NeighborhoodModule.typeDefs,
  		StreetModule.typeDefs,
  		AreaModule.typeDefs,
  		AddressModule.typeDefs,
	],
	resolvers: [
  		BranchModule.resolvers,
  		StateModule.resolvers,
  		RegionModule.resolvers,
  		NeighborhoodModule.resolvers,
  		StreetModule.resolvers,
  		AreaModule.resolvers,
  		AddressModule.resolvers,
	]
}
