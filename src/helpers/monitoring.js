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
				oldValue: `value: ${data.old_status}`,
				newValue: `value: ${data.new_status}`
			})
		}

		if (data.new_summary && (data.new_summary != data.old_summary)) {
			innerSetMonitor({
				sectionField: 'summary',
				oldValue: `value: ${data.old_summary}`,
				newValue: `value: ${data.new_summary}`
			})
		}

		if (data.new_state_id && (data.new_state_id != data.old_state_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `stateId: ${data.old_state_id}`,
				newValue: `stateId: ${data.new_state_id}`
			})
		}

		if (data.new_region_id && (data.new_region_id != data.old_region_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `regionId: ${data.old_region_id}`,
				newValue: `regionId: ${data.new_region_id}`
			})
		}

		if (data.new_neighborhood_id && (data.new_neighborhood_id != data.old_neighborhood_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `neighborhoodId: ${data.old_neighborhood_id}`,
				newValue: `neighborhoodId: ${data.new_neighborhood_id}`
			})
		}

		if (data.new_street_id && (data.new_street_id != data.old_street_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `streetId: ${data.old_street_id}`,
				newValue: `streetId: ${data.new_street_id}`
			})
		}

		if (data.new_area_id && (data.new_area_id != data.old_area_id)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `areaId: ${data.old_area_id}`,
				newValue: `areaId: ${data.new_area_id}`
			})
		}

		if (data.new_address_home_number && (data.new_address_home_number != data.old_address_home_number)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `homeNumber: ${data.old_address_home_number}`,
				newValue: `homeNumber: ${data.new_address_home_number}`
			})
		}

		if (data.new_address_target && (data.new_address_target != data.old_address_target)) {
			innerSetMonitor({
				sectionField: 'address',
				oldValue: `addressTarget: ${data.old_address_target}`,
				newValue: `addressTarget: ${data.new_address_target}`
			})
		}

		if (data.new_main_contact && (data.new_main_contact != data.old_main_contact)) {
			innerSetMonitor({
				sectionField: 'mainContact',
				oldValue: `value: ${data.old_main_contact}`,
				newValue: `value: ${data.new_main_contact}`
			})
		}

		if (data.new_second_contact && (data.new_second_contact != data.old_second_contact)) {
			innerSetMonitor({
				sectionField: 'secondContact',
				oldValue: `value: ${data.old_second_contact}`,
				newValue: `value: ${data.new_second_contact}`
			})
		}

		if (data.new_first_name && (data.new_first_name != data.old_first_name)) {
			innerSetMonitor({
				sectionField: 'firstName',
				oldValue: `value: ${data.old_first_name}`,
				newValue: `value: ${data.new_first_name}`
			})
		}

		if (data.new_last_name && (data.new_last_name != data.old_last_name)) {
			innerSetMonitor({
				sectionField: 'lastName',
				oldValue: `value: ${data.old_last_name}`,
				newValue: `value: ${data.new_last_name}`
			})
		}

		if (data.new_birth_date && (data.new_birth_date?.getTime() != data.old_birth_date?.getTime())) {
			innerSetMonitor({
				sectionField: 'birthDate',
				oldValue: `value: ${data.old_birth_date}`,
				newValue: `value: ${data.new_birth_date}`
			})
		}

		if (data.new_gender && (data.new_gender != data.old_gender)) {
			innerSetMonitor({
				sectionField: 'gender',
				oldValue: `value: ${data.old_gender}`,
				newValue: `value: ${data.new_gender}`
			})
		}

		if (data.new_branch_id && (data.new_branch_id != data.old_branch_id)) {
			innerSetMonitor({
				sectionField: 'branch',
				oldValue: `branchId: ${data.old_branch_id}`,
				newValue: `branchId: ${data.new_branch_id}`
			})
		}

		if (data.new_file && (data.new_file != data.old_file)) {
			innerSetMonitor({
				sectionField: 'file',
				oldValue: `value: ${data.old_file}`,
				newValue: `value: ${data.new_file}`
			})
		}

		if (data.new_bring_time && (data.new_bring_time?.getTime() != data.old_bring_time?.getTime())) {
			innerSetMonitor({
				sectionField: 'bringTime',
				oldValue: `value: ${data.old_bring_time}`,
				newValue: `value: ${data.new_bring_time}`
			})
		}

		if (data.new_plan && (data.new_plan != data.old_plan)) {
			innerSetMonitor({
				sectionField: 'plan',
				oldValue: `value: ${data.old_plan}`,
				newValue: `value: ${data.new_plan}`
			})
		}

		if (data.new_service_id && (data.new_service_id != data.old_service_id)) {
			innerSetMonitor({
				sectionField: 'service',
				oldValue: `serviceId: ${data.old_service_id}`,
				newValue: `serviceId: ${data.new_service_id}`
			})
		}

		if (data.new_product_size_details && (JSON.stringify(data.new_product_size_details) != JSON.stringify(data.old_product_size_details))) {
			innerSetMonitor({
				sectionField: 'service',
				oldValue: `sizeDetails: ${JSON.stringify(data.old_product_size_details)}`,
				newValue: `sizeDetails: ${JSON.stringify(data.new_product_size_details)}`
			})
		}

		if (data.new_size && (data.new_size != data.old_size)) {
			innerSetMonitor({
				sectionField: 'size',
				oldValue: `value: ${data.old_size}`,
				newValue: `value: ${data.new_size}`
			})
		}

		if (data.new_name && (data.new_name != data.old_name)) {
			innerSetMonitor({
				sectionField: 'name',
				oldValue: `value: ${data.old_name}`,
				newValue: `value: ${data.new_name}`
			})
		}

		if (data.new_color && (data.new_color != data.old_color)) {
			innerSetMonitor({
				sectionField: 'color',
				oldValue: `value: ${data.old_color}`,
				newValue: `value: ${data.new_color}`
			})
		}

		if (data.new_number && (data.new_number != data.old_number)) {
			innerSetMonitor({
				sectionField: 'number',
				oldValue: `value: ${data.old_number}`,
				newValue: `value: ${data.new_number}`
			})
		}

		if (data.new_unit && (data.new_unit != data.old_unit)) {
			innerSetMonitor({
				sectionField: 'unit',
				oldValue: `value: ${data.old_unit}`,
				newValue: `value: ${data.new_unit}`
			})
		}

		if (data.new_unit_keys && (JSON.stringify(data.new_unit_keys) != JSON.stringify(data.old_unit_keys))) {
			innerSetMonitor({
				sectionField: 'unitKeys',
				oldValue: `value: ${JSON.stringify(data.old_unit_keys)}`,
				newValue: `value: ${JSON.stringify(data.new_unit_keys)}`
			})
		}

		if (data.new_price_special && (data.new_price_special != data.old_price_special)) {
			innerSetMonitor({
				sectionField: 'price',
				oldValue: `special: ${data.old_price_special}`,
				newValue: `special: ${data.new_price_special}`
			})
		}

		if (data.new_price_simple && (data.new_price_simple != data.old_price_simple)) {
			innerSetMonitor({
				sectionField: 'price',
				oldValue: `simple: ${data.old_price_simple}`,
				newValue: `simple: ${data.new_price_simple}`
			})
		}

		if (data.new_hour_special && (data.new_hour_special != data.old_hour_special)) {
			innerSetMonitor({
				sectionField: 'deliveryHours',
				oldValue: `special: ${data.old_hour_special}`,
				newValue: `special: ${data.new_hour_special}`
			})
		}

		if (data.new_hour_simple && (data.new_hour_simple != data.old_hour_simple)) {
			innerSetMonitor({
				sectionField: 'deliveryHours',
				oldValue: `simple: ${data.old_hour_simple}`,
				newValue: `simple: ${data.new_hour_simple}`
			})
		}

		if (data.new_money_cash && (data.new_money_cash != data.old_money_cash)) {
			innerSetMonitor({
				sectionField: 'moneyAmount',
				oldValue: `cash: ${data.old_money_cash}`,
				newValue: `cash: ${data.new_money_cash}`
			})
		}

		if (data.new_money_card && (data.new_money_card != data.old_money_card)) {
			innerSetMonitor({
				sectionField: 'moneyAmount',
				oldValue: `card: ${data.old_money_card}`,
				newValue: `card: ${data.new_money_card}`
			})
		}

		if (data.new_receiver && (data.new_receiver != data.old_receiver)) {
			innerSetMonitor({
				sectionField: 'receiver',
				oldValue: `staffId: ${data.old_receiver}`,
				newValue: `staffId: ${data.new_receiver}`
			})
		}

		if (data.new_sender && (data.new_sender != data.old_sender)) {
			innerSetMonitor({
				sectionField: 'sender',
				oldValue: `staffId: ${data.old_sender}`,
				newValue: `staffId: ${data.new_sender}`
			})
		}
		
		if (data.new_expanse && (data.new_expanse != data.old_expanse)) {
			innerSetMonitor({
				sectionField: 'expanse',
				oldValue: `expanseId: ${data.old_expanse}`,
				newValue: `expanseId: ${data.new_expanse}`
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
				oldValue: `value: ${data.new_date_time}`,
				newValue: `value: ${data.new_date_time}`
			})
		}

		if (operationType == 'added' && sectionName == 'services') {
			innerSetMonitor({
				newValue: `serviceId: ${data.service_id}`
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