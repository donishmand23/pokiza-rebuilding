import addressModel from './model.js'
import { mError } from '#helpers/error'

const uzNames = {
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
	}
}