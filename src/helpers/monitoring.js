import { InternalServerError } from '#errors'

const setMonitoring = ({ userId, branchId, sectionName, sectionId, operationType }, data) => {
	try {
		const innerSetMonitor = ({ sectionField = null, oldValue = null, newValue = null }) => {
			return process.setMonitoring({
				operationType,
				sectionField,
				sectionName,
				sectionId,
				branchId,
				oldValue,
				newValue,
				userId,
			})
		}

		if (data.new_status && (data.new_status != data.old_status)) {
			innerSetMonitor({
				sectionField: 'status',
				oldValue: `${data.old_status}`,
				newValue: `${data.new_status}`
			})
		}

		if (data.new_summary && (data.new_summary != data.old_summary)) {
			innerSetMonitor({
				sectionField: 'summary',
				oldValue: `${data.old_summary}`,
				newValue: `${data.new_summary}`
			})
		}

		if (data.new_state_id && (data.new_state_id != data.old_state_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `viloyat ID: ${data.old_state_id}`,
				newValue: `viloyat ID: ${data.new_state_id}`
			})
		}

		if (data.new_region_id && (data.new_region_id != data.old_region_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `tuman ID: ${data.old_region_id}`,
				newValue: `tuman ID: ${data.new_region_id}`
			})
		}

		if (data.new_neighborhood_id && (data.new_neighborhood_id != data.old_neighborhood_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `mahalla ID: ${data.old_neighborhood_id}`,
				newValue: `mahalla ID: ${data.new_neighborhood_id}`
			})
		}

		if (data.new_street_id && (data.new_street_id != data.old_street_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `ko'cha ID: ${data.old_street_id}`,
				newValue: `ko'cha ID: ${data.new_street_id}`
			})
		}

		if (data.new_area_id && (data.new_area_id != data.old_area_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `hudud ID: ${data.old_area_id}`,
				newValue: `hudud ID: ${data.new_area_id}`
			})
		}

		if (data.new_address_home_number && (data.new_address_home_number != data.old_address_home_number)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `uy raqam: ${data.old_address_home_number}`,
				newValue: `uy raqam: ${data.new_address_home_number}`
			})
		}

		if (data.new_address_target && (data.new_address_target != data.old_address_target)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `mo'ljal: ${data.old_address_target}`,
				newValue: `mo'ljal: ${data.new_address_target}`
			})
		}

		if (data.new_main_contact && (data.new_main_contact != data.old_main_contact)) {
			innerSetMonitor({
				sectionField: 'mainContact',
				oldValue: `${data.old_main_contact}`,
				newValue: `${data.new_main_contact}`
			})
		}

		if (data.new_second_contact && (data.new_second_contact != data.old_second_contact)) {
			innerSetMonitor({
				sectionField: 'secondContact',
				oldValue: `${data.old_second_contact}`,
				newValue: `${data.new_second_contact}`
			})
		}

		if (data.new_first_name && (data.new_first_name != data.old_first_name)) {
			innerSetMonitor({
				sectionField: 'firstName',
				oldValue: `${data.old_first_name}`,
				newValue: `${data.new_first_name}`
			})
		}

		if (data.new_last_name && (data.new_last_name != data.old_last_name)) {
			innerSetMonitor({
				sectionField: 'lastName',
				oldValue: `${data.old_last_name}`,
				newValue: `${data.new_last_name}`
			})
		}

		if (data.new_birth_date && (data.new_birth_date?.getTime() != data.old_birth_date?.getTime())) {
			innerSetMonitor({
				sectionField: 'birthDate',
				oldValue: `${data.old_birth_date}`,
				newValue: `${data.new_birth_date}`
			})
		}

		if (data.new_gender && (data.new_gender != data.old_gender)) {
			innerSetMonitor({
				sectionField: 'gender',
				oldValue: `${data.old_gender}`,
				newValue: `${data.new_gender}`
			})
		}

		if (data.new_branch_id && (data.new_branch_id != data.old_branch_id)) {
			innerSetMonitor({
				sectionField: 'branch',
				oldValue: `filial ID: ${data.old_branch_id}`,
				newValue: `filial ID: ${data.new_branch_id}`
			})
		}

		if (data.new_file && (data.new_file != data.old_file)) {
			innerSetMonitor({
				sectionField: 'file',
				oldValue: `${data.old_file}`,
				newValue: `${data.new_file}`
			})
		}

		if (data.new_bring_time && (data.new_bring_time?.getTime() != data.old_bring_time?.getTime())) {
			innerSetMonitor({
				sectionField: 'bringTime',
				oldValue: `${data.old_bring_time}`,
				newValue: `${data.new_bring_time}`
			})
		}

		if (data.new_plan && (data.new_plan != data.old_plan)) {
			innerSetMonitor({
				sectionField: 'plan',
				oldValue: `${data.old_plan}`,
				newValue: `${data.new_plan}`
			})
		}

		if (data.new_service_id && (data.new_service_id != data.old_service_id)) {
			innerSetMonitor({
				sectionField: 'service',
				oldValue: `servis ID: ${data.old_service_id}`,
				newValue: `servis ID: ${data.new_service_id}`
			})
		}

		if (data.new_product_size_details && (JSON.stringify(data.new_product_size_details) != JSON.stringify(data.old_product_size_details))) {
			innerSetMonitor({
				sectionField: 'service',
				oldValue: `o'lchov detallari: ${JSON.stringify(data.old_product_size_details)}`,
				newValue: `o'lchov detallari: ${JSON.stringify(data.new_product_size_details)}`
			})
		}

		if (data.new_size && (data.new_size != data.old_size)) {
			innerSetMonitor({
				sectionField: 'size',
				oldValue: `${data.old_size}`,
				newValue: `${data.new_size}`
			})
		}

		if (data.new_name && (data.new_name != data.old_name)) {
			innerSetMonitor({
				sectionField: 'name',
				oldValue: `${data.old_name}`,
				newValue: `${data.new_name}`
			})
		}

		if (data.new_color && (data.new_color != data.old_color)) {
			innerSetMonitor({
				sectionField: 'color',
				oldValue: `${data.old_color}`,
				newValue: `${data.new_color}`
			})
		}

		if (data.new_number && (data.new_number != data.old_number)) {
			innerSetMonitor({
				sectionField: 'number',
				oldValue: `${data.old_number}`,
				newValue: `${data.new_number}`
			})
		}

		if (data.new_broken && (data.new_broken !== data.old_broken)) {
			innerSetMonitor({
				sectionField: 'availability',
				oldValue: `${data.old_broken}`,
				newValue: `${data.new_broken}`
			})
		}

		if (data.new_unit && (data.new_unit != data.old_unit)) {
			innerSetMonitor({
				sectionField: 'unit',
				oldValue: `${data.old_unit}`,
				newValue: `${data.new_unit}`
			})
		}

		if (data.new_unit_keys && (JSON.stringify(data.new_unit_keys) != JSON.stringify(data.old_unit_keys))) {
			innerSetMonitor({
				sectionField: 'unitKeys',
				oldValue: `${JSON.stringify(data.old_unit_keys)}`,
				newValue: `${JSON.stringify(data.new_unit_keys)}`
			})
		}

		if (data.new_price_special && (data.new_price_special != data.old_price_special)) {
			innerSetMonitor({
				sectionField: 'price',
				oldValue: `maxsus: ${data.old_price_special}`,
				newValue: `maxsus: ${data.new_price_special}`
			})
		}

		if (data.new_price_simple && (data.new_price_simple != data.old_price_simple)) {
			innerSetMonitor({
				sectionField: 'price',
				oldValue: `oddiy: ${data.old_price_simple}`,
				newValue: `oddiy: ${data.new_price_simple}`
			})
		}

		if (data.new_hour_special && (data.new_hour_special != data.old_hour_special)) {
			innerSetMonitor({
				sectionField: 'deliveryHours',
				oldValue: `maxsus: ${data.old_hour_special}`,
				newValue: `maxsus: ${data.new_hour_special}`
			})
		}

		if (data.new_hour_simple && (data.new_hour_simple != data.old_hour_simple)) {
			innerSetMonitor({
				sectionField: 'deliveryHours',
				oldValue: `oddiy: ${data.old_hour_simple}`,
				newValue: `oddiy: ${data.new_hour_simple}`
			})
		}

		if (data.new_money_cash && (data.new_money_cash != data.old_money_cash)) {
			innerSetMonitor({
				sectionField: 'moneyAmount',
				oldValue: `naqd: ${data.old_money_cash}`,
				newValue: `naqd: ${data.new_money_cash}`
			})
		}

		if (data.new_money_card && (data.new_money_card != data.old_money_card)) {
			innerSetMonitor({
				sectionField: 'moneyAmount',
				oldValue: `plastik: ${data.old_money_card}`,
				newValue: `plastik: ${data.new_money_card}`
			})
		}

		if (data.new_receiver && (data.new_receiver != data.old_receiver)) {
			innerSetMonitor({
				sectionField: 'receiver',
				oldValue: `xodim ID: ${data.old_receiver}`,
				newValue: `xodim ID: ${data.new_receiver}`
			})
		}

		if (data.new_sender && (data.new_sender != data.old_sender)) {
			innerSetMonitor({
				sectionField: 'sender',
				oldValue: `xodim ID: ${data.old_sender}`,
				newValue: `xodim ID: ${data.new_sender}`
			})
		}
		
		if (data.new_expanse && (data.new_expanse != data.old_expanse)) {
			innerSetMonitor({
				sectionField: 'expanse',
				oldValue: `xarajat ID: ${data.old_expanse}`,
				newValue: `xarajat ID: ${data.new_expanse}`
			})
		}

		if (
			(data.new_money && (data.new_money != data.old_money)) ||
			(data.old_money_type != data.new_money_type)
		) {
			innerSetMonitor({
				sectionField: 'moneyAmount',
				oldValue: `${data.old_money_type}: ${data.old_money}`,
				newValue: `${data.new_money_type}: ${data.new_money}`
			})
		}

		if (data.new_date_time && ((new Date(data.new_date_time))?.getTime() != (new Date(data.old_date_time))?.getTime())) {
			innerSetMonitor({
				sectionField: 'dateTime',
				oldValue: `${data.new_date_time}`,
				newValue: `${data.new_date_time}`
			})
		}

		if (operationType == 'added' && sectionName == 'services') {
			innerSetMonitor({
				newValue: `servis ID: ${data.service_id}`
			})
		}

		if (['deleted', 'restored'].includes(operationType)) {
			innerSetMonitor({})
		}
	} catch (error) {
		throw new InternalServerError(error.message || error.detail || error)
	}
}


export {
	setMonitoring
}