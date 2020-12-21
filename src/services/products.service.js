import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.VUE_APP_API_BASE_URL + '/products/';

class ProductsService {
  index(page = 1) {
    console.log(API_URL)
    return axios.get(API_URL + '?page='+page, { headers: authHeader() });
  }

  store(data) {
    return axios.post(API_URL, data,{ headers: authHeader() });
  }

  update(id, data) {
    return axios.put(API_URL + id, data, { headers: authHeader() });
  }

  show(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  destroy(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new ProductsService();
