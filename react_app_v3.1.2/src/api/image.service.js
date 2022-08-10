import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_IMAGE_URL;

class ImageService {

  getImagelist() {
    return axios.get(API_URL + 'status/', { headers: authHeader() });
  }

  getImageDetail(image_id) {
    return axios.get(API_URL + 'status/' + image_id +'/', { headers: authHeader() });
  }

  deleteImage(image_id) {
     return axios.delete(API_URL + 'status/' + image_id +'/', { headers: authHeader() });
  }

  findImageonPACSCloud(patient_id, pascloud_selection, study_date) {
    if (patient_id === undefined || patient_id === null) {
      patient_id = '*';
    }
    if (study_date === undefined || study_date === null) {
      study_date = '*';
    }
    
    const headers = authHeader();
    Object.assign(headers, {
                            "X-PACSCloud-IPaddr": pascloud_selection.ip_addr, 
                            "X-PACSCloud-AETiltle": pascloud_selection.ae_title });
    return  axios
            .get(API_URL + 'action/find/?patient_id=' + patient_id + '&study_date=' + study_date,  { 
              headers: headers,
              });
  }
  findImageonPACSClient(patient_id, pasclient_selection, study_date) {
    
    const headers = authHeader();
    Object.assign(headers, {
                            "X-PACSCloud-IPaddr": pasclient_selection.ip_addr, 
                            "X-PACSCloud-AETiltle": pasclient_selection.ae_title });
    return  axios
            .get(API_URL + 'action/find/?patient_id=' + patient_id + '&study_date='+ study_date,   { 
              headers: headers,
              });
  }

  downloadImageonPACSCloud(patient_id, study_instanceuid, modalities, image_count, pascloud_selection, pacsclient_id, pacscloud_id) {
    const headers = authHeader();
    Object.assign(headers, {
                            "X-PACSCloud-IPaddr": pascloud_selection.ip_addr, 
                            "X-PACSCloud-AETiltle": pascloud_selection.ae_title});
    return axios
            .post(API_URL + 'action/download/', {
              patient_id,
              study_instanceuid,
              modalities,
              image_count,
              pacsclient_id,
              pacscloud_id,
            },
            { 
              headers: headers,
            });
  }

  sendImagetoPACSClient(image_id, pacsclient_selection) {
    const headers = authHeader();
    Object.assign(headers, {
                            "X-PACSClient-IPaddr": pacsclient_selection.ip_addr, 
                            "X-PACSClient-AETiltle": pacsclient_selection.ae_title});
    return axios
            .post(API_URL + 'action/send/',{
              image_id,
            },
            { 
              headers: headers,
              });
  }

  checkPacsNodeStatus(ipaddr, port, aetitle) {
    return axios
            .get(API_URL + 'setting/checkstatus/?ipaddr=' + ipaddr + '&port=' + port + '&aetitle=' + aetitle, 
            { headers: authHeader() });
  }
}

export default new ImageService();