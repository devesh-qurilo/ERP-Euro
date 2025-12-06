// /src/services/socketClient.js
import { io } from 'socket.io-client';
import EventEmitter from 'events';

class SocketClient extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.connected = false;
  }

  connect({ url, token }) {
    if (this.socket) this.disconnect();

    // Accept token as raw JWT or "Bearer <token>"
    const rawToken =
      token && token.startsWith('Bearer ') ? token.substring(7) : token;

    this.socket = io(url, {
      auth: { token: rawToken },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.connected = true;
      this.emit('connected');
    });

    this.socket.on('disconnect', reason => {
      this.connected = false;
      this.emit('disconnected', reason);
    });

    this.socket.on('message', msg => this.emit('message', msg));
    this.socket.on('typing', payload => this.emit('typing', payload));
    this.socket.on('message-status', payload =>
      this.emit('message-status', payload),
    );
    this.socket.on('online-status', payload =>
      this.emit('online-status', payload),
    );
    this.socket.on('message-ack', payload => this.emit('message-ack', payload));

    // forward generic error events
    this.socket.on('error', err => this.emit('error', err));

    return this.socket;
  }

  disconnect() {
    try {
      if (this.socket) {
        this.socket.disconnect();
      }
    } catch (e) {}
    this.socket = null;
    this.connected = false;
  }

  joinRoom(roomId) {
    if (!this.socket) return;
    this.socket.emit('join-room', roomId);
  }

  sendMessage(payload) {
    if (!this.socket) throw new Error('socket not connected');
    this.socket.emit('message', payload);
  }

  sendTyping(to, typing) {
    if (!this.socket) return;
    this.socket.emit('typing', { to, typing });
  }

  sendOnlineStatus({ online, timestamp }) {
    if (!this.socket) return;
    // If backend expects employeeId, it will use socket auth principal.
    this.socket.emit('online-status', { online, timestamp });
  }

  sendReadReceipt(messageId) {
    if (!this.socket) return;
    this.socket.emit('read-receipt', { messageId });
  }
}

const singleton = new SocketClient();
export default singleton;
