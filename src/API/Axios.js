import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.45.246:8080', 
});

export default instance;