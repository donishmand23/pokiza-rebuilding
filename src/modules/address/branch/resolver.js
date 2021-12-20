import branchModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addBranch: async (_, arg) => {
			try {
				const newBranch = await branchModel.addBranch(arg)
				return {
					status: 200,
					message: "Yangi filial qo'shildi!",
					data: newBranch
				}
			} catch (error) { return mError(error) }
		},

		changeBranch: async(_, arg) => {
			try {
				const updatebranch = await branchModel.changeBranch(arg)
				return {
					status: 200,
					message: "Filial yangilandi!",
					data: updatebranch
				}
			} catch (error) { return mError(error) }
		},
	},
	Query: {
		branches: async (_, arg) => {
			try {
				const branches = await branchModel.branches(arg)
				return branches
			} catch (error) {
				throw error
			}
		} 
	},
	Branch: {
		branchId:        global => global.branch_id, 
		branchName:      global => global.branch_name, 
		branchCreatedAt: global => global.branch_created_at, 
	}
}