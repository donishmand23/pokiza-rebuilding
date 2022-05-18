import { fetch, fetchAll } from '#utils/postgres'
import PermissionQuery from '#sql/permission'
import permissions from '../permissions.js'

/*
    queryName
    permissions to query
    branchId
    arguments
*/

export default async (body, payload) => { 
    //const {
    //    transportId,
    //    productId, 
    //    serviceId, 
    //    branchId, 
    //    clientId, 
    //    orderId, 
    //    staffId,
    //    userId,
    //    userAddress,
    //    addressFilter,
    //    address,
    //} = variables

    if (body['operation'] === 'query') {
        const query = body['fieldName']
        const queryPermissions = permissions[query]

        let allowedBranches = []

        const userPermissions = await fetchAll(PermissionQuery.PERMISSION_SETS, payload.staffId, queryPermissions)
        if (userPermissions.length) {
            allowedBranches = userPermissions.map(per => per.branch_id)
        }

        payload.allowedBranches = allowedBranches
        return 
    }

}