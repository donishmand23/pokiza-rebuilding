import { fetch, fetchAll } from '#utils/postgres'
import StateQuery from '#sql/state'
import RegionQuery from '#sql/region'
import NeighborhoodQuery from '#sql/neighborhood'
import StreetQuery from '#sql/street'
import AreaQuery from '#sql/area'
const Query = {...StateQuery, ...RegionQuery, ...NeighborhoodQuery, ...StreetQuery, ...AreaQuery}

const disableEnable = ({ addressField, addressFieldId, uzNames, actionName }) => {
	return addressFieldId.map( async id => {
		const item = await fetch(Query[`${actionName.toUpperCase()}_${addressField.toUpperCase()}`], id)
		if(!item) throw new Error(`${id} idlik ${uzNames[addressField]} mavjud emas!`)
		return item
	} )
}


export default {
	disableEnable,
}