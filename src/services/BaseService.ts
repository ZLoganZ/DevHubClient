import axios from 'axios';
import {
  API_KEY,
  CLIENT_ID,
  DOMAIN_NAME,
  TOKEN,
  TOKEN_GITHUB
} from '@/util/constants/SettingSystem';

export class BaseService {
  put(url: string, model: any) {
    // return axios({
    //   url: `${DOMAIN_NAME}${url}`,
    //   method: 'PUT',
    //   data: model,
    //   withCredentials: true,
    //   headers: {
    //     Authorization: localStorage.getItem(TOKEN),
    //     'x-api-key': localStorage.getItem(API_KEY),
    //     'x-client-id': localStorage.getItem(CLIENT_ID)
    //   }
    // });
    return axios.put(`${DOMAIN_NAME}${url}`, model, {
      headers: {
        Authorization: localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
  post(url: string, model?: any) {
    // return axios({
    //   url: `${DOMAIN_NAME}${url}`,
    //   method: 'POST',
    //   data: model,
    //   withCredentials: true,
    //   headers: {
    //     Authorization: localStorage.getItem(TOKEN),
    //     'x-api-key': localStorage.getItem(API_KEY),
    //     'x-client-id': localStorage.getItem(CLIENT_ID)
    //   }
    // });
    return axios.post(`${DOMAIN_NAME}${url}`, model, {
      headers: {
        Authorization: localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
  get(url: string, model?: any) {
    // return axios({
    //   url: `${DOMAIN_NAME}${url}`,
    //   method: 'GET',
    //   data: model,
    //   withCredentials: true,
    //   headers: {
    //     Authorization: localStorage.getItem(TOKEN),
    //     'x-api-key': localStorage.getItem(API_KEY),
    //     'x-client-id': localStorage.getItem(CLIENT_ID)
    //   }
    // });
    return axios.get(`${DOMAIN_NAME}${url}`, {
      headers: {
        Authorization: localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      data: model,
      withCredentials: true
    });
  }
  delete(url: string) {
    // return axios({
    //   url: `${DOMAIN_NAME}${url}`,
    //   method: 'DELETE',
    //   withCredentials: true,
    //   headers: {
    //     Authorization: localStorage.getItem(TOKEN),
    //     'x-api-key': localStorage.getItem(API_KEY),
    //     'x-client-id': localStorage.getItem(CLIENT_ID)
    //   }
    // });
    return axios.delete(`${DOMAIN_NAME}${url}`, {
      headers: {
        Authorization: localStorage.getItem(TOKEN),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
  getgithub(url: string) {
    // return axios({
    //   url: `${DOMAIN_NAME}${url}`,
    //   method: 'GET',
    //   withCredentials: true,
    //   headers: {
    //     Authorization: localStorage.getItem(TOKEN),
    //     access_token_github: localStorage.getItem(TOKEN_GITHUB),
    //     'x-api-key': localStorage.getItem(API_KEY),
    //     'x-client-id': localStorage.getItem(CLIENT_ID)
    //   }
    // });
    return axios.get(`${DOMAIN_NAME}${url}`, {
      headers: {
        Authorization: localStorage.getItem(TOKEN),
        access_token_github: localStorage.getItem(TOKEN_GITHUB),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
}
