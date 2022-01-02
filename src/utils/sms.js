import nodeFetch from 'node-fetch'
import FormData from 'form-data'
import ServiceQuery from '#sql/service'
import { fetch } from '#utils/postgres'


const sendPassword = async (contact, code) => {
	const { sms_servise_token } = await fetch(ServiceQuery.SMS_SERVICE)

	const headers = new nodeFetch.Headers()
	const formdata = new FormData()

	headers.append("Authorization", "Bearer " + sms_servise_token)
	formdata.append("mobile_phone", contact)
	formdata.append("message", `Sizning parolingiz: ${code}`)
	formdata.append("from", "PokizaGilam")

	const requestOptions = {
		method: 'POST',
		headers: headers,
		body: formdata,
		redirect: 'follow'
	}

	try {

		let response = await nodeFetch("https://notify.eskiz.uz/api/message/sms/send", requestOptions)
		response = await response.json()

		if(response.status != "error" && response.status_code != 500 && response.status_code != 401) {
			return {
				error: false, 
				message: `${contact} ga kod yuborildi! Kod 3 daqiqa davomida amal qiladi!`
			}
		} else {
			throw new Error("Kod yuborishda muammolik yuz berdi. Qaytadan urinib ko'ring!")
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

		formdata.append("email", sms_service_email)
		formdata.append("password", sms_service_password)

		const requestOptions = {
			method: 'POST',
			body: formdata,
			redirect: 'follow'
		}
	
		let response = await nodeFetch("https://notify.eskiz.uz/api/auth/login", requestOptions)
		response = await response.json()

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