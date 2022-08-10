import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_IMAGE_URL;

class SettingService {

  getSettingPACSCloud() {
    return axios.get(API_URL + 'setting/pacscloud/', { headers: authHeader() });
  }

  getSettingPACSClient() {
    return axios.get(API_URL + 'setting/pacsclient/', { headers: authHeader() });
  }

}

export default new SettingService();