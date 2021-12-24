// address modules
import BranchModule from './address/branch/index.js'
import StateModule from './address/state/index.js'
import RegionModule from './address/region/index.js'
import NeighborhoodModule from './address/neighborhood/index.js'
import StreetModule from './address/street/index.js'
import AreaModule from './address/area/index.js'
import AddressModule from './address/address/index.js'

// extra modules
import SocialSetModule from './extra/social-set/index.js'


export default {
	typeDefs: [
		// address
  		BranchModule.typeDefs,
  		StateModule.typeDefs,
  		RegionModule.typeDefs,
  		NeighborhoodModule.typeDefs,
  		StreetModule.typeDefs,
  		AreaModule.typeDefs,
  		AddressModule.typeDefs,
  		// extra
  		SocialSetModule.typeDefs,
	],
	resolvers: [
		// address
  		BranchModule.resolvers,
  		StateModule.resolvers,
  		RegionModule.resolvers,
  		NeighborhoodModule.resolvers,
  		StreetModule.resolvers,
  		AreaModule.resolvers,
  		AddressModule.resolvers,
  		// extra
  		SocialSetModule.resolvers,
	]
}
