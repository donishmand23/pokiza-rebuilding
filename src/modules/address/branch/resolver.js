import { InternalServerError } from '#errors'
import branchModel from './model.js'

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
				} else throw new InternalServerError("Filial qo'shishda muammolik yuz berdi!")
			} catch (error) { 
				throw error
			 }
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
				} else throw new InternalServerError("Filialni yangilashda muammolik yuz berdi!")
			} catch (error) { 
				throw error
			 }
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