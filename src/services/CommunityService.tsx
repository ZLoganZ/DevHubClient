import { BaseService } from "./BaseService";

export class CommunityService extends BaseService {
  constructor() {
    super();
  }
  getCommunityByID = (id: string) => {
    return this.get(`/communities/${id}`);
  };
}

export const communityService = new CommunityService();
