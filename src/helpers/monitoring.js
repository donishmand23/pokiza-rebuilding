const setMonitoring = ({ userId, branchId, sectionName, sectionId, operationType }, data) => {
	
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

	if(data.new_status && (data.new_status != data.old_status)) {
		innerSetMonitor({ 
			sectionField: 'status', 
			oldValue: `value: ${data.old_status}`, 
			newValue: `value: ${data.new_status}` 
		})
	}

	if(data.new_summary && (data.new_summary != data.old_summary)) {
		innerSetMonitor({ 
			sectionField: 'summary', 
			oldValue: `value: ${data.old_summary}`, 
			newValue: `value: ${data.new_summary}` 
		})
	}

	if(data.new_state_id && (data.new_state_id != data.old_state_id)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `stateId: ${data.old_state_id}`, 
			newValue: `stateId: ${data.new_state_id}` 
		})
	}

	if(data.new_region_id && (data.new_region_id != data.old_region_id)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `regionId: ${data.old_region_id}`, 
			newValue: `regionId: ${data.new_region_id}` 
		})
	}

	if(data.new_neighborhood_id && (data.new_neighborhood_id != data.old_neighborhood_id)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `neighborhoodId: ${data.old_neighborhood_id}`, 
			newValue: `neighborhoodId: ${data.new_neighborhood_id}` 
		})
	}

	if(data.new_street_id && (data.new_street_id != data.old_street_id)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `streetId: ${data.old_street_id}`, 
			newValue: `streetId: ${data.new_street_id}` 
		})
	}

	if(data.new_area_id && (data.new_area_id != data.old_area_id)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `areaId: ${data.old_area_id}`, 
			newValue: `areaId: ${data.new_area_id}` 
		})
	}

	if(data.new_address_home_number && (data.new_address_home_number != data.old_address_home_number)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `homeNumber: ${data.old_address_home_number}`, 
			newValue: `homeNumber: ${data.new_address_home_number}` 
		})
	}

	if(data.new_address_target && (data.new_address_target != data.old_address_target)) {
		innerSetMonitor({ 
			sectionField: 'address', 
			oldValue: `addressTarget: ${data.old_address_target}`, 
			newValue: `addressTarget: ${data.new_address_target}` 
		})
	}

	if(data.new_main_contact && (data.new_main_contact != data.old_main_contact)) {
		innerSetMonitor({ 
			sectionField: 'mainContact', 
			oldValue: `value: ${data.old_main_contact}`, 
			newValue: `value: ${data.new_main_contact}` 
		})
	}

	if(data.new_second_contact && (data.new_second_contact != data.old_second_contact)) {
		innerSetMonitor({ 
			sectionField: 'secondContact', 
			oldValue: `value: ${data.old_second_contact}`, 
			newValue: `value: ${data.new_second_contact}` 
		})
	}

	if(data.new_first_name && (data.new_first_name != data.old_first_name)) {
		innerSetMonitor({ 
			sectionField: 'firstName', 
			oldValue: `value: ${data.old_first_name}`, 
			newValue: `value: ${data.new_first_name}` 
		})
	}

	if(data.new_last_name && (data.new_last_name != data.old_last_name)) {
		innerSetMonitor({ 
			sectionField: 'lastName', 
			oldValue: `value: ${data.old_last_name}`, 
			newValue: `value: ${data.new_last_name}` 
		})
	}

	if(data.new_birth_date && (data.new_birth_date?.getTime() != data.old_birth_date?.getTime())) {
		innerSetMonitor({ 
			sectionField: 'birthDate', 
			oldValue: `value: ${data.old_birth_date}`, 
			newValue: `value: ${data.new_birth_date}` 
		})
	}

	if(data.new_gender && (data.new_gender != data.old_gender)) {
		innerSetMonitor({ 
			sectionField: 'gender', 
			oldValue: `value: ${data.old_gender}`, 
			newValue: `value: ${data.new_gender}` 
		})
	}

	if(data.new_branch_id && (data.new_branch_id != data.old_branch_id)) {
		innerSetMonitor({ 
			sectionField: 'branch', 
			oldValue: `branchId: ${data.old_branch_id}`, 
			newValue: `branchId: ${data.new_branch_id}` 
		})
	}

	if(data.new_file && (data.new_file != data.old_file)) {
		innerSetMonitor({ 
			sectionField: 'file', 
			oldValue: `value: ${data.old_file}`, 
			newValue: `value: ${data.new_file}` 
		})
	}

	if(['deleted', 'restored'].includes(operationType)) {
		innerSetMonitor({})
	}
}

export {
	setMonitoring
}