import branchModel from './model.js'
import { mError } from '#helpers/error'

export default {
	Mutation: {
		addBranch: async (_, arg) => {
			try {
				const newBranch = await branchModel.addBranch(arg)
				if(newBranch) {
					return {
						status: 200,
						message: "Yangi filial qo'shildi!",
						data: newBranch
					}
				} else throw new Error("Filial qo'shishda muammolik yuz berdi!")
			} catch (error) { return mError(error) }
		},

		changeBranch: async(_, arg) => {
			try {
				const updatedBranch = await branchModel.changeBranch(arg)
				if(updatedBranch) {
					return {
						status: 200,
						message: "Filial yangilandi!",
						data: updatedBranch
					} 
				} else throw new Error("Filialni yangilashda muammolik yuz berdi!")
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