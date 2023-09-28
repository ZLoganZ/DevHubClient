import PusherClient from 'pusher-js';

import { CLIENT_ID, DOMAIN_NAME, AUTHORIZATION } from './constants/SettingSystem';

export const pusherClient = new PusherClient(import.meta.env.VITE_PUSHER_APP_KEY, {
  channelAuthorization: {
    headers: {
      Authorization: localStorage.getItem(AUTHORIZATION),
      'x-client-id': localStorage.getItem(CLIENT_ID)
    },
    endpoint: DOMAIN_NAME + '/pusher/auth',
    transport: 'ajax'
  },
  cluster: 'ap1'
});
