import staffModel from './model.js'
import { mError } from '#helpers/error'

export default {
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
		staffImg:       global => global.staff_img,
		staffCreatedAt: global => global.staff_created_at,
		staffInfo:      global => staffModel.user({ userId: global.user_id }),
	}
}