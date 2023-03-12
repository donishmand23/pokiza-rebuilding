import { fetch, fetchAll } from '#utils/postgres'
import NotificationQuery from '#sql/notificaton'
import UserQuery from '#sql/user'

const notifications = async ({ senderUserId, receiverUserId, pagination }) => {
	const { page, limit } = pagination
		
	return fetchAll(NotificationQuery.NOTIFICATIONS, (page - 1) * limit, limit, senderUserId, receiverUserId)
}

const staff = ({ staffId }) => {
	return fetch(UserQuery.USER, false, 0, staffId, 0)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USER, false, userId, 0, 0)
}

const sendNotifications = ({ user, branchId, userId, staffId, file, gender, notificationTitle, notificationBody }) => {
	return fetchAll(NotificationQuery.SEND_NOTIFICATION, staffId, notificationTitle, notificationBody, file, branchId, user, userId, gender)
}

const deleteNotifications = ({ userId, notificationId }) => {
	return fetchAll(NotificationQuery.DELETE_NOTIFICATIONS, userId, notificationId)
}

export default {
	deleteNotifications,
	sendNotifications,
	notifications,
	staff,
	user,
}