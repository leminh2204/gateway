import axios from "axios";

const API_URL = process.env.REACT_APP_AUTH_URL;

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "token/", {
        username,
        password,
      })
      .then(response => {
        if (response.data) {
          localStorage.setItem("accesstoken", JSON.stringify(response.data.access));
          localStorage.setItem("refreshtoken", JSON.stringify(response.data.refresh));
        }
      });
  }


  logout() {
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("accesstoken");
    window.location.reload();
  }

  register(username, email, password) {
    return axios.post(API_URL + "users/", {
      username,
      email,
      password
    });
  }

  check_valid_token() {
    const token = JSON.parse(localStorage.getItem('accesstoken'));
    return axios.post(API_URL + "token/verify/", {token,})
  }

  refresh_valid_token() {
    const refresh = JSON.parse(localStorage.getItem('refreshtoken'));
    return axios.
            post(API_URL + "token/refresh/", {refresh,})
      .then(response => {
        if (response.data) {
          localStorage.setItem("accesstoken", JSON.stringify(response.data.access));
        }
      });
  }

}

export default new AuthService();