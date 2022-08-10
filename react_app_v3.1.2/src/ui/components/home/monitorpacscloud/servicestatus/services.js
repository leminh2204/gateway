function datalineCPU(list_data){
	let data = [];
	if (list_data.length) {
		for (const [key, value] of Object.entries(list_data[0])){
			for (let j=0; j < value.length; j++){
				let date = new Date(value[j][0] * 1000);
				let hours = date.getHours();
				let minutes = "0" + date.getMinutes();
				let seconds = "0" + date.getSeconds();
				let  formattedTime = hours  + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
				data.push(
						{
							name: formattedTime,
							[key]: 100 - value[j][1]
						}
					);
			}
		}
	}
	if (list_data.length > 1){
		for(let i=1; i<list_data.length; i++){
			for (const [key, value] of Object.entries(list_data[i])){
				for (let j=0; j < value.length; j++){
					data[j][key] = value[j][1];
				}
			}
		}
	}
	return data
}


function datapie(list_data){
	let data=[];
	if (list_data.length){
		for(let i=0; i<list_data.length; i++){
			for (const [key, value] of Object.entries(list_data[i])){
				data.push({
					name: key,
					value: Math.round((value / (1024 * 1024 * 1024) +  Number.EPSILON) * 100) / 100
				});
			}
		}
	}
	return data
}

function datalineRAM(list_data){
	let data = [];
	let total_ram;
	if (list_data.length) {
		total_ram=list_data[0].memory_total;		
		for (const [key, value] of Object.entries(list_data[1])){
			for (let j=0; j < value.length; j++){
				let date = new Date(value[j][0] * 1000);
				let hours = date.getHours();
				let minutes = "0" + date.getMinutes();
				let seconds = "0" + date.getSeconds();
				let  formattedTime = hours  + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
				data.push(
						{
							name: formattedTime,
							[key]: value[j][1] / total_ram * 100
						}
					);
			}
		}
	}
	if (list_data.length > 2){
		for(let i=2; i<list_data.length; i++){
			for (const [key, value] of Object.entries(list_data[i])){
				for (let j=0; j < value.length; j++){
					data[j][key] = value[j][1] / total_ram * 100;
				}
			}
		}
	}	
	return data
}


export {datalineCPU, datapie, datalineRAM};