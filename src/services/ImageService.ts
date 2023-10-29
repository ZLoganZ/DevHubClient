import { AxiosResponse } from 'axios';

import { ImageResponse, ResponseType } from '@/types';
import { BaseService } from './BaseService';

class ImageService extends BaseService {
  constructor() {
    super();
  }
  uploadImage = (data: FormData): Promise<AxiosResponse<ResponseType<ImageResponse>>> => {
    return this.post(`/images/upload-one`, data);
  };

  uploadImages = (data: FormData): Promise<AxiosResponse<ResponseType<ImageResponse[]>>> => {
    return this.post(`/images/upload-multiple`, data);
  };
}

export const imageService = new ImageService();
