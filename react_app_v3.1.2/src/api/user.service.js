import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_AUTH_URL;

class UserService {

  getUserlist() {
    return axios.get(API_URL + 'users/', { headers: authHeader() });
  }

  getUserDetail() {
    return axios.get(API_URL + 'users/', { headers: authHeader() });
  }

  UpdateUser() {
    return axios.get(API_URL + 'users/', { headers: authHeader() });
  }
}

export default new UserService();