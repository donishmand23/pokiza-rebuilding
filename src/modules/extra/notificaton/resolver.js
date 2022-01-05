import notificationModel from './model.js'
import upload from '#helpers/upload'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		sendNotifications: async (_, args, { staffId }) => {
			try {
				await upload(args)
				const sentNotifications = await notificationModel.sendNotifications({ staffId, ...args })
				if(sentNotifications.length) {
					return {
						status: 200,
						message: "Xabarnomalar yuborildi!",
						data: null
					}
				} else throw new Error("Xatolik yuz berdi!" + (!sentNotifications.length ? " Foydalanuvchi(lar) filterga mos kelmadi!" : ""))
			} catch(error) { return mError(error) }
		},

		deleteNotifications: async (_, args) => {
			try {
				const deletedNotifications = await notificationModel.deleteNotifications(args)
				if(deletedNotifications.length) {
					return {
						status: 200,
						message: "Xabarnomalar o'chirildi! Ularni qayta tiklab bo'lmaydi",
						data: null
					}
				} else throw new Error("Xabarnomalar allaqachon o'chirib yuborilgan!")
			} catch(error) { return mError(error) }
		}
	},

	Query: {
		notifications: async (_, args, { userId }) => {
			try {
				const notifications = await notificationModel.notifications({ userId })
				return notifications
			} catch(error) {
				throw error
			}
		}
	},
	
	Notification: {
		notificationId:        global =>  global.notification_id,
		notificationTitle:     global =>  global.notification_title,
		notificationBody:      global =>  global.notification_body,
		notificationCreatedAt: global =>  global.notification_created_at,
		receiver: async global =>  {
			const { client, staff } = await notificationModel.user({ userId: global.notification_to })
			return client || staff
		},
		sender: async global =>  {
			const { staff } = await notificationModel.staff({ staffId: global.notification_from })
			return staff
		},
		notificationImg: global => {
			return global.notification_img && '/data/uploads/' + global.notification_img
		},
	},
}