import ServiceQuery from '#sql/service'
import { FormData } from 'formdata-node'
import { fetch } from '#utils/postgres'
import got from 'got'


const sendPassword = async (contact, code) => {
	const { sms_service_token } = await fetch(ServiceQuery.SMS_SERVICE)

	const formdata = new FormData()

	formdata.append('mobile_phone', contact + '')
	formdata.append('message', `Sizning parolingiz: ${code}`)
	formdata.append('from', 'PokizaGilam')

	const requestOptions = {
		headers: { Authorization: 'Bearer ' + sms_service_token },
		body: formdata
	}

	try {

		let response = await got.post('https://notify.eskiz.uz/api/message/sms/send', requestOptions).json()
		let sentStatus = await got.get('https://notify.eskiz.uz/api/message/sms/status/' + response.id, {
			headers: { Authorization: 'Bearer ' + sms_service_token }
		}).json()

		if(sentStatus.status == 'success' && response.status != 'error' && response.status_code != 500 && response.status_code != 401) {
			return {
				error: false, 
				message: `${contact} ga kod yuborildi! Kod 3 daqiqa davomida amal qiladi!`
			}
		} else {
			throw response.message
		}

	} catch(error) {
		await refreshSmsToken()
		throw error
	}
}

async function refreshSmsToken () {
	try {
		const { sms_service_id, sms_service_email, sms_service_password } = await fetch(ServiceQuery.SMS_SERVICE)

		const formdata = new FormData()

		formdata.append('email', sms_service_email)
		formdata.append('password', sms_service_password)
	
		let response = await got.post('https://notify.eskiz.uz/api/auth/login', { body: formdata }).json()

		let newSmsToken = await fetch(
			ServiceQuery.CHANGE_SMS_SERVICE, 
			sms_service_id,
			response.data.token, 
		)

	} catch (error) {
		throw error
	}
}


export {
	sendPassword
}