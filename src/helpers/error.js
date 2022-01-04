const mError = (error) => {
	return { 
		status: "ERROR", 
		message: error.detail  || error.message || error,
		registered: false,
		data: null 
	}
}

export {
	mError
}