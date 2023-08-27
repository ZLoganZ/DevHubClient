import { BaseService } from './BaseService';

export class GetStartedService extends BaseService {
  constructor() {
    super();
  }
  chooseGetStarted = (number: number) => {
    return this.post(`/getstarted`, number);
  };
  chooseInterest = (interest: unknown) => {
    return this.post(`/users/expertise`, interest);
  };
  getShouldFollower = () => {
    return this.get(`/user/shouldFollow`);
  };
  chooseShouldFollowPeople = (arrPeople: unknown) => {
    return this.post(`/interest`, arrPeople);
  };
}

export const getStartedService = new GetStartedService();
