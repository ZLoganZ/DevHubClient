import axios from 'axios';
import {
  API_KEY,
  DOMAIN_NAME,
  TOKEN,
  TOKEN_GITHUB
} from '@/util/constants/SettingSystem';

export class BaseService {
  put(url: string, model: any) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: 'PUT',
      data: model,
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY)
      }
    });
  }
  post(url: string, model: any) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: 'POST',
      data: model,
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY)
      }
    });
  }
  get(url: string) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY)
      }
    });
  }
  delete(url: string) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: 'DELETE',
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY)
      }
    });
  }
  getgithub(url: string) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
        access_token_github: localStorage.getItem(TOKEN_GITHUB),
        'x-api-key': localStorage.getItem(API_KEY)
      }
    });
  }
}
