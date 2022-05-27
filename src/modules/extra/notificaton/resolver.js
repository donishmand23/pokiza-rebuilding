import { BadRequestError } from '#errors'
import notificationModel from './model.js'
import upload from '#helpers/upload'

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
				} else throw new BadRequestError("Xatolik yuz berdi!" + (!sentNotifications.length ? " Foydalanuvchi(lar) filterga mos kelmadi!" : ""))
			} catch(error) { 
				throw error
			 }
		},

		deleteNotifications: async (_, args, { userId }) => {
			try {
				const deletedNotifications = await notificationModel.deleteNotifications({ userId, ...args })
				if(deletedNotifications.length) {
					return {
						status: 200,
						message: "Xabarnomalar o'chirildi! Ularni qayta tiklab bo'lmaydi",
						data: null
					}
				} else throw new BadRequestError("Bunday xabarnomalar mavjud emas!")
			} catch(error) { 
				throw error
			 }
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