import { fetch, fetchAll } from '#utils/postgres'
import PermissionQuery from '#sql/permission'
import UserQuery from '#sql/user'
import permissions from '../permissions.js'

/*
    queryName
    permissions to query
    branchId
    arguments
*/

export default async (body, payload) => { 
    if (body['operation'] === 'query') {
        const query = body['fieldName']
        const queryPermissions = permissions[query]

        let allowedBranches = []

        if (payload.staffId) {
            const userPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId, queryPermissions)
            if (userPermissions.length) {
                allowedBranches = userPermissions.map(per => per.branch_id)
            } 
        }

        if (payload.clientId) {
            const { branch_id } = await fetch(UserQuery.USER_BRANCH, payload.userId)
            allowedBranches = [ branch_id ]
        }

        payload.allowedBranches = allowedBranches
        return 
    }

}