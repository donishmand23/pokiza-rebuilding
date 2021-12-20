const mError = (error) => {
	return { 
		status: "ERROR", 
		message: error.detail  || error.message || error, 
		data: null 
	}
}

export {
	mError
}