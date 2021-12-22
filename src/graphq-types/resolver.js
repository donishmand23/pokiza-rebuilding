import { GraphQLScalarType, Kind } from 'graphql'

function checkDateType (value) {
	try {
		const dateRegEx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
		const timeRegEx = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/
		const [ date, time ] = value.split(' ')
		const testForDate = dateRegEx.test(date)
		const testForTime = timeRegEx.test(time)
		if(!testForDate) throw new Error("Invaild date for type Date")
		if(!testForTime) throw new Error("Invaild time for type Date")
	} catch (error) {
		throw new Error('Date type must be a string like "dd-mm-yy hh:mm:ss"')
	}
	return value
}

function checkIdType (value) {
	try {
		if( !(typeof(+value) === 'number') && isNaN(+value) ) {
			throw new Error("ID type must be Int!")
		}
		if(value < 0) {
			throw new Error("ID type must positive Int!")
		}
	} catch (error) {
		throw new Error("ID type must be Int!")
	}
	return value
}

const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize: checkDateType,
	parseValue: checkDateType,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
	      	return checkDateType(ast.value)
  		} else throw new Error('Date type must be a string like "dd-mm-yy hh:mm:ss"')
	},
})

const idScalar = new GraphQLScalarType({
	name: 'ID',
	description: 'ID custom scalar type',
	serialize: checkIdType,
	parseValue: checkIdType,
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
	      	return checkIdType(ast.value)
  		} else throw new Error("ID type must be Int!")
	},
})

export default {
	Date: dateScalar,
	ID: idScalar,

	AddressTypes: {
		__resolveType (obj, context, info) {
			if(obj.state_id && obj.state_name && obj.state_created_at) {
				return 'State'
			}
			if(obj.region_id && obj.region_name && obj.region_created_at) {
				return 'Region'
			}
			if(obj.neighborhood_id && obj.neighborhood_name && obj.neighborhood_created_at) {
				return 'Neighborhood'
			}
			if(obj.street_id && obj.street_name && obj.street_created_at) {
				return 'Street'
			}
			if(obj.area_id && obj.area_name && obj.area_created_at) {
				return 'Area'
			}
		}
	},

	BigTypes: {
		__resolveType (obj, context, info) {
			if(obj.branch_id && obj.branch_name && obj.branch_created_at) {
				return 'Branch'
			}
			if(obj.state_id && obj.state_name && obj.state_created_at) {
				return 'State'
			}
			if(obj.region_id && obj.region_name && obj.region_created_at) {
				return 'Region'
			}
			if(obj.neighborhood_id && obj.neighborhood_name && obj.neighborhood_created_at) {
				return 'Neighborhood'
			}
			if(obj.street_id && obj.street_name && obj.street_created_at) {
				return 'Street'
			}
			if(obj.area_id && obj.area_name && obj.area_created_at) {
				return 'Area'
			}
		}
	}
}