import { fetch, fetchAll } from '#utils/postgres'
import SocialSetQuery from '#sql/socialSet'

const socialSets = async ({ socialSetId = 0 }) => {
	return fetchAll(SocialSetQuery.SOCIAL_SETS, socialSetId)
}

const addSocialSet = async ({ socialSetName, socialSetIcon }) => {
	return fetch(SocialSetQuery.ADD_SOCIAL_SET, socialSetName, socialSetIcon)
}

const changeSocialSet = async ({ socialSetId, socialSetName = '', socialSetIcon = '' }) => {
	return fetch(SocialSetQuery.CHANGE_SOCIAL_SET, socialSetId, socialSetName, socialSetIcon)
}


export default {
	changeSocialSet,
	addSocialSet,
	socialSets,
}