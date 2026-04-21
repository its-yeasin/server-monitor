import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function initWebSocket(): Socket {
  if (socket) return socket;

  socket = io(API_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
}

export function subscribeToServer(serverId: string) {
  if (socket) {
    socket.emit('subscribe:server', serverId);
  }
}

export function unsubscribeFromServer(serverId: string) {
  if (socket) {
    socket.emit('unsubscribe:server', serverId);
  }
}

export { socket };
