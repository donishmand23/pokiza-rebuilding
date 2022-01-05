import { fetch, fetchAll } from '#utils/postgres'
import NotificationQuery from '#sql/notificaton'
import UserQuery from '#sql/user'

const notifications = async ({ userId }) => {
	return fetchAll(NotificationQuery.NOTIFICATIONS, userId)
}

const staff = ({ staffId }) => {
	return fetch(UserQuery.USER, false, 0, staffId, 0)
}

const user = ({ userId }) => {
	return fetch(UserQuery.USER, false, userId, 0, 0)
}

const sendNotifications = ({ user, branchId, userId, staffId, file, notificationTitle, notificationBody }) => {
	return fetchAll(NotificationQuery.SEND_NOTIFICATION, staffId, notificationTitle, notificationBody, file, branchId, user, userId)
}

const deleteNotifications = ({ userId = [], notificationId = [] }) => {
	if(userId.length || notificationId.length) {
		return fetchAll(NotificationQuery.DELETE_NOTIFICATIONS, notificationId, userId)
	} else throw new Error("Parametr kiritilishi shart!")
}

export default {
	deleteNotifications,
	sendNotifications,
	notifications,
	staff,
	user,
}