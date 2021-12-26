import { GraphQLScalarType, Kind } from 'graphql'

// DateTime scalar
const dateTimeScalar = new GraphQLScalarType({
	name: 'DateTime',
	description: 'DateTime custom scalar type',
	serialize: checkDateTimeType,
	parseValue: checkDateTimeType,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
	      	return checkDateTimeType(ast.value)
  		} else {
  			throw new Error('DateTime type must be a string like "YYYY-MM-DD hh:mm:ss"')
  		}
	},
})

function checkDateTimeType (value) {
	try {
		const dateRegEx = /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))$/
		const timeRegEx = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/

		const [ date, time ] = value.split(' ')
		const testForDate = dateRegEx.test(date)
		const testForTime = timeRegEx.test(time)
		if(!testForDate) {
			throw new Error("Invaild date for type Date")
		}
		if(!testForTime) {
			throw new Error("Invaild time for type Date")
		}
	} catch (error) {
		throw new Error('Date type must be a string like "YYYY-MM-DD hh:mm:ss"')
	}
	return value
}



// Date scalar
const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize: checkDateType,
	parseValue: checkDateType,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
	      	return checkDateType(ast.value)
  		} else {
  			throw new Error('DateTime type must be a string like "YYYY-MM-DD"')
  		}
	},
})

function checkDateType (value) {
	const dateRegEx = /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))$/
	const testForDate = dateRegEx.test(value)
	if(!testForDate) {
		throw new Error('Date type must be a string like "YYYY-MM-DD"')
	}
	return value
}



// ID scalar
const idScalar = new GraphQLScalarType({
	name: 'ID',
	description: 'ID custom scalar type',
	serialize: checkIdType,
	parseValue: checkIdType,
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
	      	return checkIdType(ast.value)
  		} else {
  			throw new Error("ID type must be Int!")
  		}
	},
})

function checkIdType (value) {
	if( !(typeof(+value) === 'number') && isNaN(+value) ) {
		throw new Error("ID type must be Int!")
	}
	if(value < 0) {
		throw new Error("ID type must positive Int!")
	}
	return value
}



// SVG scalar
const svgScalar = new GraphQLScalarType({
	name: 'SVG',
	description: 'SVG custom scalar type',
	serialize: checkSvgType,
	parseValue: checkSvgType,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
	      	return checkSvgType(ast.value)
  		} else {
  			throw new Error("SVG type must be String!")
  		}
	},
})

function checkSvgType (value) {
	if( !(typeof(value) === 'string') ) {
		throw new Error("SVG type must be String!")
	}
	return value
}



// Contact scalar
const contactScalar = new GraphQLScalarType({
	name: 'Contact',
	description: 'Contact custom scalar type',
	serialize: checkContact,
	parseValue: checkContact,
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
	      	return checkContact(ast.value)
  		} else {
  			throw new Error('Contact type must be a string!"')
  		}
	},
})

function checkContact (value) {
	const contactRegEx = /^998[389][012345789][0-9]{7}$/
	const testForContact = contactRegEx.test(value)
	if(!testForContact) {
		throw new Error("Invalid Contact type!")
	}
	return value
}



export default {
	DateTime: dateTimeScalar,
	Date: dateScalar,
	ID: idScalar,
	SVG: svgScalar,
	Contact: contactScalar,

	Gender: {
		male: 1,
		female: 2
	},

	SortOptions: {
		toSmallest: 1,
		toLargest: 2
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
			if(obj.social_set_id && obj.social_set_name && obj.social_set_created_at) {
				return 'SocialSet'
			}
			if(obj.client_id && obj.client_status && obj.client_created_at && obj.client_summary) {
				return 'Client'
			}
			if(obj.staff_id && obj.staff_created_at) {
				return 'Staff'
			}
		}
	}
}