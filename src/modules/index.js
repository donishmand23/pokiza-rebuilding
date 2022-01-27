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
import SearchModule from './extra/search/index.js'
import NotificationModule from './extra/notificaton/index.js'
import SMSModule from './extra/sms/index.js'

// user modules
import UserModule from './user/user/index.js'
import ClientModule from './user/client/index.js'
import StaffModule from './user/staff/index.js'

// service modules
import ServiceModule from './service/service/index.js'
import TransportModule from './service/transport/index.js'

// order modules
import OrderModule from './order/order/index.js'
import ProductModule from './order/product/index.js'
import StatusModule from './order/status/index.js'

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
  		SearchModule.typeDefs,
  		NotificationModule.typeDefs,
  		SMSModule.typeDefs,
  		// user
  		UserModule.typeDefs,
  		ClientModule.typeDefs,
  		StaffModule.typeDefs,
  		// service
  		ServiceModule.typeDefs,
  		TransportModule.typeDefs,
  		// order
  		OrderModule.typeDefs,
  		ProductModule.typeDefs,
  		StatusModule.typeDefs,
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
  		SearchModule.resolvers,
  		NotificationModule.resolvers,
  		SMSModule.resolvers,
  		// user
  		UserModule.resolvers,
  		ClientModule.resolvers,
  		StaffModule.resolvers,
  		// service
  		ServiceModule.resolvers,
  		TransportModule.resolvers,
  		// order
  		OrderModule.resolvers,
  		ProductModule.resolvers,
  		StatusModule.resolvers,
	]
}
