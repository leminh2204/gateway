import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MONITOR_URL;

class MonitorService {
  getDirectoryFilelist(path_directory) {
    const headers = authHeader();
    Object.assign(headers, {
                            "X-PACSCloud-IPaddr": process.env.REACT_APP_PACSCloud_IPaddr,
                        	}); 	
    return axios.get(API_URL + 'directory/?path_directory=' + path_directory, { 
			headers: headers ,
			});
  }

  getServiceMeasure(metric, server_selected, start_time, end_time, steptime) {
    const headers =authHeader();
    Object.assign(headers, {
                            "X-PACSCloud-IPaddr": process.env.REACT_APP_PACSCloud_IPaddr,
                        	}); 	
    return axios.get(API_URL + 'system/?metric=' + metric +
                                      '&server_selected=' + server_selected +
                                      '&start_time='+ start_time + 
                                      '&end_time=' + end_time +
                                      '&steptime=' + steptime, { 
        headers: headers,
			});	
  }

}

export default new MonitorService();