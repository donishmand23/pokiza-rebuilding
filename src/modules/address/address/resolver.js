import addressModel from './model.js'
import { mError } from '#helpers/error'

const uzNames = {
	branch: "Filial",
	state: "Viloyat",
	region: "Tuman",
	neighborhood: "Mahalla",
	street: "Ko'cha",
	area: "Hudud",
}

export default {
	Mutation: {
		disableAddress: async (_, { addressField, addressFieldId }) => {
			const disabledAddressData = await addressModel.disableEnable({ addressField, addressFieldId, uzNames, actionName: 'disable' })
			if(disabledAddressData.length) {
				return {
					status: 200,
					message: `${uzNames[addressField]}lar o'chirildi! Siz uni qayta tiklashingiz mumkin.`,
					data: disabledAddressData
				}
			} else throw new Error(`${uzNames[addressField]}ni o'chirishda muammolik yuz berdi!`)
		},

		enableAddress: async (_, { addressField, addressFieldId }) => {
			const enabledAddressData = await addressModel.disableEnable({ addressField, addressFieldId, uzNames, actionName: 'enable' })
			if(enabledAddressData.length) {
				return {
					status: 200,
					message: `${uzNames[addressField]}lar yoqildi!`,
					data: enabledAddressData
				}
			} else throw new Error(`${uzNames[addressField]}ni yoqishda muammolik yuz berdi!`)
		}
	},

	Query: {
		disabledAddresses: async (_, args) => {
			try {
				const addresses = await addressModel.addresses(args)
				return addresses
			} catch(error) {
				throw error
			}
		}
	},

	Address: {
		addressId: 	       global => global.address_id,
		addressHomeNumber: global => global.address_home_number,
		addressTarget:     global => global.address_target, 
		addressCreatedAt:  global => global.address_created_at,
		neighborhood:      global => addressModel.neighborhood({ neighborhoodId: global.neighborhood_id }), 
		region:            global => addressModel.region({ regionId: global.region_id }),
		street:            global => addressModel.street({ streetId: global.street_id }), 
		state:             global => addressModel.state({ stateId: global.state_id }),
		area:              global => addressModel.area({ areaId: global.area_id }), 
	},

	AddressTypes: {
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
	},
}