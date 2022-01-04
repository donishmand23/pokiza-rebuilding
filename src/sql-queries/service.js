const SMS_SERVICE = `
	SELECT 
		sms_service_id,
		sms_service_email,
		sms_service_password,
		sms_service_token,
		sms_service_created_at
	FROM sms_service
`

const CHANGE_SMS_SERVICE = `
	UPDATE sms_service SET 
		sms_service_token = $2, 
		sms_service_created_at = current_timestamp 
	WHERE sms_service_id = $1 
	RETURNING *
`

export default {
	CHANGE_SMS_SERVICE,
	SMS_SERVICE
}