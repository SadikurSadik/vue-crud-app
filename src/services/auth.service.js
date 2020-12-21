import axios from 'axios';

const API_URL = process.env.VUE_APP_API_BASE_URL;

class AuthService {
  login(user) {
    return axios
      .post(API_URL + '/auth/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
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
    return axios.post(API_URL + '/signup', {
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
