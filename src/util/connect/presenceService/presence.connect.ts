import io from 'socket.io-client';

const host = 'http://localhost:4056';

const presenceService = '/presence-service';

export const clientPresence = io(`${host}${presenceService}`);