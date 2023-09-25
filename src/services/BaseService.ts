import axios from 'axios';
import {
  API_KEY,
  CLIENT_ID,
  DOMAIN_NAME,
  AUTHORIZATION,
  GITHUB_TOKEN
} from '@/util/constants/SettingSystem';

export class BaseService {
  put(url: string, model: any) {
    return axios.put(`${DOMAIN_NAME}${url}`, model, {
      headers: {
        Authorization: localStorage.getItem(AUTHORIZATION),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
  post(url: string, model?: any) {
    return axios.post(`${DOMAIN_NAME}${url}`, model, {
      headers: {
        Authorization: localStorage.getItem(AUTHORIZATION),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
  get(url: string, model?: any) {
    return axios.get(`${DOMAIN_NAME}${url}`, {
      headers: {
        Authorization: localStorage.getItem(AUTHORIZATION),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      data: model,
      withCredentials: true
    });
  }
  delete(url: string) {
    return axios.delete(`${DOMAIN_NAME}${url}`, {
      headers: {
        Authorization: localStorage.getItem(AUTHORIZATION),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
  getGithub(url: string) {
    return axios.get(`${DOMAIN_NAME}${url}`, {
      headers: {
        Authorization: localStorage.getItem(AUTHORIZATION),
        'x-github-token': localStorage.getItem(GITHUB_TOKEN),
        'x-api-key': localStorage.getItem(API_KEY),
        'x-client-id': localStorage.getItem(CLIENT_ID)
      },
      withCredentials: true
    });
  }
}
