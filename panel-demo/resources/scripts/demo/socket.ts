import { EventEmitter } from 'events';
import { command, findServer, listeners, power, stats } from './data';

export class DemoWebsocket extends EventEmitter {
    private uuid = '';
    private timer: ReturnType<typeof setInterval> | null = null;
    private forward = (id: string, event: string, args: any[]) => { if (id === this.uuid) this.emit(event, ...args); };
    setToken(_token: string, _update = false): this { return this; }
    connect(url: string): this {
        this.uuid = findServer(url.replace(/^demo:/, '')).uuid;
        listeners.add(this.forward);
        setTimeout(() => { if (this.uuid) { this.emit('SOCKET_OPEN'); this.emit('auth success'); this.send('send stats'); } }, 80);
        this.timer = setInterval(() => this.send('send stats'), 2500);
        return this;
    }
    send(event: string, payload?: string | string[]) {
        if (!this.uuid) return;
        const server = findServer(this.uuid);
        if (event === 'send stats') {
            this.emit('status', server.power);
            this.emit('stats', JSON.stringify({ ...stats(server).resources, state: server.power, metrics_scope: 'sample-data' }));
        }
        if (event === 'send logs') {
            this.emit('console output', '\u001b[36m[DEMO] FDevPanel · FarizDev’s Termux Native\u001b[0m');
            this.emit('console output', '[DEMO] Real Panel components, simulated server data.');
            this.emit('console output', '[DEMO] Try help, list, echo hello, or stop.');
            this.emit('status', server.power);
        }
        if (event === 'send command') command(server, String(Array.isArray(payload) ? payload[0] : payload || ''));
        if (event === 'set state') power(server, String(Array.isArray(payload) ? payload[0] : payload));
    }
    authenticate() { this.emit('auth success'); }
    open() { if (this.uuid) this.emit('SOCKET_OPEN'); }
    reconnect() { this.open(); }
    close(_code?: number, _reason?: string) {
        if (this.timer) clearInterval(this.timer);
        listeners.delete(this.forward);
        this.uuid = '';
        this.emit('SOCKET_CLOSE');
    }
}
