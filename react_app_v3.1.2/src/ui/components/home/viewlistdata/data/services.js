function checkLoadDataFail(response){
	const check_load_fail = (response.data.dicomdownloadstatus[0].download_status !== '0x0000' && 
							response.data.download_status===201) || (response.data.send_status===201 && 
							parseInt(response.data.dicomsendstatus[0].imagesend_failed));
	return check_load_fail
}

function checkDownloadSuccessNotsend(response){
	const check_download_success_notsend = 	response.data.dicomdownloadstatus[0].download_status === '0x0000' && 
									response.data.download_status === 201 && response.data.dicomdownloadstatus[0].imagedownload_completed && 
									response.data.send_status === null;
	return check_download_success_notsend
}

function checkLoadComplete(response){
	const check_load_complete = response.data.download_status !== 202 && response.data.send_status !== 202 && 
								response.data.send_status !== null
	return check_load_complete
}

function timeDatabaseFormat(time) {
	return (time.split(".",1))[0].replace("T", " ");
}

export {checkLoadDataFail, checkDownloadSuccessNotsend, checkLoadComplete, timeDatabaseFormat};