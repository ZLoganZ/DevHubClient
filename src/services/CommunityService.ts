import { BaseService } from './BaseService';

class CommunityService extends BaseService {
  constructor() {
    super();
  }
  getCommunityByID = (id: String) => {
    return this.get(`/communities/${id}`);
  };
}

export const communityService = new CommunityService();
