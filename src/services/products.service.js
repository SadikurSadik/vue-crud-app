import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/v1/products/';

class ProductsService {
  index() {
    return axios.get(API_URL, { headers: authHeader() });
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
