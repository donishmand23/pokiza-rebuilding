import staffModel from './model.js'
import upload from '#helpers/upload'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addStaff: async (_, args) => {
			try {
				await upload(args)
				const newStaff = await staffModel.addStaff(args)
				if(newStaff) {
					return {
						status: 200,
						message: "Yangi xodim qo'shildi!'",
						data: newStaff
					}
				} else throw new Error("Xodim qo'shishda muammolik yuz berdi!")  
			} catch(error) { return mError(error) }
		},

		changeStaff: async (_, args) => {
			try {
				await upload(args)
				const updatedStaff = await staffModel.changeStaff(args)
				if(updatedStaff) {
					return {
						status: 200,
						message: "Xodim ma'lumotlari yangilandi!'",
						data: updatedStaff
					}
				} else throw new Error("Xodim ma'lumotlarini yangilashda muammolik yuz berdi!")
			} catch(error) { return mError(error) }
		},
	},

	Query: {
		staffs: async (_, args) => {
			try {
				const staffs = await staffModel.staffs(args)
				return staffs
			} catch(error) {
				throw error
			}
		}
	},

	Staff: {
		satffId:        global => global.staff_id,
		count:          global => global.full_count,
		staffSummary:   global => global.staff_summary,
		staffCreatedAt: global => global.staff_created_at,
		staffInfo:      global => staffModel.user({ userId: global.user_id }),
		staffImg:       global => {
			if(!global.staff_img && global.user_gender == 1) return '/data/uploads/male.jpg'
			if(!global.staff_img && global.user_gender == 2) return '/data/uploads/female.jpg'
			else return global.staff_img
		},
	}
}