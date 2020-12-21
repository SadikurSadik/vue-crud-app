import axios from 'axios';
import config from '../../vue.config';

const API_URL = config.apiBaseUrl;

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'auth/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        console.log(response);
        if (response.data.access_token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
