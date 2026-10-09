import test from 'node:test';
import assert from 'node:assert/strict';
import { command, files, findServer, listeners, power, respond, servers } from '../panel-demo/resources/scripts/demo/data.ts';

test('real Panel API shapes, native server data and startup variables', () => {
    const response = respond('/api/client');
    assert.equal(response.data.length, 4);
    assert.equal(response.meta.pagination.total, 4);
    const server = respond('/api/client/servers/demo0001');
    assert.equal(server.meta.is_server_owner, true);
    assert.equal(server.attributes.docker_image, 'farizdev-termux-native');
    assert.equal(respond('/api/client/servers/demo0001/startup').data[0].attributes.env_variable, 'SERVER_JARFILE');
    assert.deepEqual(respond('/api/client/servers/demo0001/startup').meta.docker_images, {});
});
test('all server operations reject external endpoints and unknown servers', () => {
    assert.throws(() => respond('http://localhost:8000/api/client'), /blocked/);
    assert.throws(() => respond('https://example.com/api/client'), /blocked/);
    assert.throws(() => findServer('unknown'), /Unknown/);
    assert.throws(() => respond('/etc/passwd'), /not available/);
});
test('virtual files are editable and renamed only within the demo state', () => {
    const prefix = '/api/client/servers/demo0003/files';
    respond(prefix+'/write?file=%2Ftest.txt', 'post', 'DEMO_CONTENT');
    assert.equal(respond(prefix+'/contents?file=%2Ftest.txt'), 'DEMO_CONTENT');
    respond(prefix+'/rename', 'put', { root: '/', files: [{ from: 'test.txt', to: 'renamed.txt' }] });
    assert.equal(respond(prefix+'/contents?file=%2Frenamed.txt'), 'DEMO_CONTENT');
    assert.throws(() => respond(prefix+'/rename', 'put', { root: '/', files: [{ from: 'renamed.txt', to: '../escape' }] }), /filename/);
    respond(prefix+'/delete', 'post', { root: '/', files: ['renamed.txt'] });
    assert.throws(() => respond(prefix+'/contents?file=%2Frenamed.txt'), /not found/);
});
test('simulated power changes broadcast and duplicate starts do not duplicate transitions', async () => {
    const server = findServer('demo0003');
    const events = [];
    const listener = (id, event, args) => { if (id === server.uuid) events.push({ event, args }); };
    listeners.add(listener);
    try {
        power(server, 'start'); power(server, 'start');
        assert.equal(server.power, 'starting');
        await new Promise(resolve => setTimeout(resolve, 700));
        assert.equal(server.power, 'running');
        assert.equal(events.filter(e => e.event === 'status' && e.args[0] === 'starting').length, 1);
        command(server, 'echo <script>alert(1)</script>');
        assert(events.some(e => e.event === 'console output' && e.args[0] === '<script>alert(1)</script>'));
        power(server, 'stop');
        await new Promise(resolve => setTimeout(resolve, 700));
        assert.equal(server.power, 'offline');
    } finally { listeners.delete(listener); }
});
