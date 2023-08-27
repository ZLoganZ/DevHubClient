import axios from "axios";
import {
  DOMAIN_NAME,
  TOKEN,
  TOKEN_GITHUB,
} from "@/utils/constants/SettingSystem";

export class BaseService {
  put(url: string, model: any) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: "PUT",
      data: model,
      withCredentials: true,
      headers: { Authorization: "Bearer " + localStorage.getItem(TOKEN) },
    });
  }
  post(url: string, model: any) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: "POST",
      data: model,
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + localStorage.getItem(TOKEN) || "",
      },
    });
  }
  get(url: string) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: "GET",
      withCredentials: true,
      headers: { Authorization: "Bearer " + localStorage.getItem(TOKEN) },
    });
  }
  delete(url: string) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: "DELETE",
      withCredentials: true,
      headers: { Authorization: "Bearer " + localStorage.getItem(TOKEN) },
    });
  }
  getgithub(url: string) {
    return axios({
      url: `${DOMAIN_NAME}${url}`,
      method: "GET",
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + localStorage.getItem(TOKEN),
        access_token_github: localStorage.getItem(TOKEN_GITHUB),
      },
    });
  }
}
