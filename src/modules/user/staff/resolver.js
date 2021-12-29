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
				} else throw new Error("Bunday xodim mavjud emas!")
			} catch(error) { return mError(error) }
		},

		deleteStaff: async (_, args) => {
			try {
				const deletedStaffs = await staffModel.deleteStaff(args)
				if(deletedStaffs.length) {
					return {
						status: 200,
						message: "Xodimlar o'chirildi! Agar ularning asosiy raqami band qilib olinmasa, uni qayta tiklash mumkin.",
						data: deletedStaffs
					}
				} else throw new Error("Bunday xodimlar mavjud emas!")
			} catch(error) { return mError(error) }
		},

		restoreStaff: async (_, args) => {
			try {
				const restoredStaffs = await staffModel.restoreStaff(args)
				if(restoredStaffs.length) {
					return {
						status: 200,
						message: "Xodimlar qayta tiklandi!",
						data: restoredStaffs
					}
				} else throw new Error("Bunday o'chirilgan xodimlar mavjud emas!")
			} catch(error) { 
				if(error.message.includes("users_user_main_contact_key")) {
					return mError("Xodimni tiklashni imkoni yo'q. Chunki telefon raqam allaqachon boshqa akkountdan ro'yxatdan o'tkazilgan.")
				}
				return mError(error)
			}
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
		staffInfo:      global => {
			if(global.user) return global.user
			else return staffModel.user({ userId: global.user_id })
		},
		staffImg:       global => {
			if(!global.staff_img && global.user_gender == 1) return '/data/uploads/male.jpg'
			if(!global.staff_img && global.user_gender == 2) return '/data/uploads/female.jpg'
			else return '/data/uploads/' + global.staff_img
		},
	}
}