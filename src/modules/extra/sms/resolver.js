import smsModel from './model.js'
import { mError } from '#helpers/error'
import { sendSMS } from '#utils/sms'

export default {
	Mutation: {
		sendSMS: async (_, args, { staffId }) => {
			try {
				const userContacts = await smsModel.userContacts({ staffId, ...args })
				if(userContacts.length) {
					await sendSMS(userContacts, args.smsText)
					return {
						status: 200,
						message: "SMS yuborildi!",
						data: null
					}
				} else throw new Error("Bunday foydalanuvchilar mavjud emas!")
			} catch(error) { return mError(error) }
		}
	},
}