import PusherClient from 'pusher-js';

export const pusherClient = new PusherClient(import.meta.env.VITE_PUSHER_APP_KEY, {
  channelAuthorization: {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    endpoint: 'http://localhost:7000/api/pusher/auth',
    transport: 'ajax',
  },
  cluster: 'ap1',
});
