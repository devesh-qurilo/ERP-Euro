// /src/services/socketStomp.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import EventEmitter from 'events';

// const DEFAULT_URL = 'https://6jnqmj85-80.inc1.devtunnels.ms/ws-chat';
// const DEFAULT_URL = 'https://6jnqmj85-80.inc1.devtunnels.ms/ws-chat';
const DEFAULT_URL = 'https://erp.skavosystem.com/ws-chat';

class StompSocket extends EventEmitter {
  constructor() {
    super();
    this.client = null;
    this.connected = false;
    this.currentToken = null;
  }

  connect({ token, url = DEFAULT_URL }) {
    if (this.client) {
      try {
        this.disconnect();
      } catch (e) {}
    }

    this.currentToken = token;

    // stompjs Client
    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: frame => {
        this.connected = true;
        this.emit('connect', frame);
      },
      onDisconnect: evt => {
        this.connected = false;
        this.emit('disconnect', evt);
      },
      onStompError: frame => {
        this.emit('stompError', frame);
      },
      onWebSocketClose: evt => {
        this.connected = false;
        this.emit('disconnect', evt);
      },
      debug: msg => {
        // comment out or use console.debug
        // console.debug('[STOMP]', msg);
      },
    });

    // wire generic message callback (we'll use subscriptions for app events)
    this.client.activate();
    return this.client;
  }

  disconnect() {
    if (!this.client) return;
    try {
      this.client.deactivate();
    } catch (e) {}
    this.client = null;
    this.connected = false;
    this.emit('disconnect', { reason: 'manual' });
  }

  /**
   * Subscribe to a destination, returns subscription object
   * handler receives message (StompMessage)
   */
  subscribe(destination, handler, headers = {}) {
    if (!this.client) throw new Error('Not connected');
    return this.client.subscribe(
      destination,
      message => {
        let body = null;
        try {
          body = JSON.parse(message.body);
        } catch (e) {
          body = message.body;
        }
        handler({ headers: message.headers, body, raw: message });
      },
      headers,
    );
  }

  unsubscribe(sub) {
    try {
      sub.unsubscribe();
    } catch (e) {}
  }

  send(destination, payload = {}, headers = {}) {
    if (!this.client) throw new Error('Not connected');
    const body =
      typeof payload === 'string' ? payload : JSON.stringify(payload);
    this.client.publish({ destination, body, headers });
  }

  /**
   * Reconnect using new token (this will disconnect & connect)
   */
  updateToken(newToken, url) {
    this.currentToken = newToken;
    // reconnect with same url
    try {
      this.disconnect();
    } catch (e) {}
    this.connect({ token: newToken, url });
  }
}

const singleton = new StompSocket();
export default singleton;
