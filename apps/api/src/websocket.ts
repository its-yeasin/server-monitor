import { Server as SocketIO } from 'socket.io';

export function setupWebSocket(io: SocketIO) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe:server', (serverId: string) => {
      socket.join(`server:${serverId}`);
      console.log(`Client ${socket.id} subscribed to server ${serverId}`);
    });

    socket.on('unsubscribe:server', (serverId: string) => {
      socket.leave(`server:${serverId}`);
      console.log(`Client ${socket.id} unsubscribed from server ${serverId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
