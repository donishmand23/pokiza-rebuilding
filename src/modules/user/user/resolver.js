import userModel from './model.js'
import { mError } from '#helpers/error'

export default {
	UserInfo: {
		userId:        global => global.user_id,
		mainContact:   global => global.user_main_contact,
		secondContact: global => global.user_second_contact,
		firstName:     global => global.user_first_name,
		lastName:      global => global.user_last_name,
		birthDate:     global => global.user_birth_date,
		age:           global => global.user_age,
		gender:        global => global.user_gender,
		joinedAt:      global => global.user_created_at,
		branch:        global => userModel.branch({ branchId: global.branch_id }),
		address:       global => userModel.address({ addressId: global.address_id }),
	},
}