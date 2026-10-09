// Public fixtures only. No live Panel/Wings identifiers or credentials.
export const timestamp = '2026-01-01T12:00:00Z';
export const listeners = new Set<(id: string, event: string, args: any[]) => void>();
export const servers: any[] = [
    ['demo0001', 'Survival SMP', 'Paper · A little world, a lot of possibilities.', 1536, 25565, 'running'],
    ['demo0002', 'Community bot', 'Node.js · Keeping the conversation going.', 256, 3000, 'running'],
    ['demo0003', 'Python playground', 'Python · Ideas start with a few lines of code.', 256, 8001, 'offline'],
    ['demo0004', 'Velocity gateway', 'Velocity · The front door to your network.', 512, 25577, 'offline'],
].map(([id, name, description, memory, port, power], index) => ({
    identifier: id, server_identifier: id, internal_id: index + 1, __deprecated_uuid_short: id,
    uuid: `00000000-0000-4000-8000-00000000000${index + 1}`, name, description,
    node: 'Sample Android node', is_node_under_maintenance: false, status: null,
    sftp_details: { ip: 'demo.invalid', port: 2022 },
    invocation: index === 0 ? 'java -Xms128M -Xmx1024M -jar server.jar' : index === 1 ? 'node index.js' : index === 2 ? 'python main.py' : 'java -Xmx384M -jar velocity.jar',
    docker_image: 'farizdev-termux-native', limits: { memory, swap: 0, disk: 2048, io: 500, cpu: 0, threads: null },
    feature_limits: { databases: 2, allocations: 3, backups: 2 }, egg_features: [], is_transferring: false,
    skip_scripts: false, power,
    relationships: {
        allocations: { object: 'list', data: [{ object: 'allocation', attributes: { id: index + 1, ip: '127.0.0.1', ip_alias: 'Sample allocation', port, notes: 'Demo only', is_default: true } }] },
        variables: { object: 'list', data: [{ object: 'egg_variable', attributes: { name: index === 0 ? 'Server JAR' : 'Application file', description: 'Sample startup variable; changes stay in this browser session.', env_variable: index === 0 ? 'SERVER_JARFILE' : 'APP_FILE', default_value: index === 0 ? 'server.jar' : index === 1 ? 'index.js' : 'main.py', server_value: index === 0 ? 'server.jar' : index === 1 ? 'index.js' : 'main.py', is_editable: true, rules: 'required|string|max:128' } }] },
    },
}));

servers[0].relationships.variables.data.push({ object: 'egg_variable', attributes: { name: 'Java version', description: 'Sample Java selection. The real egg supports Java 17, 21 and 25.', env_variable: 'JAVA_VERSION', default_value: '21', server_value: '21', is_editable: true, rules: 'required|integer|in:17,21,25' } });

export function findServer(id: string) {
    const server = servers.find(item => item.identifier === id || item.uuid === id);
    if (!server) throw new Error('Unknown sample server');
    return server;
}
export function stats(server: any) {
    const running = server.power === 'running';
    return { state: server.power, current_state: server.power, is_suspended: false,
        resources: { memory_bytes: running ? Math.round(server.limits.memory * .42) * 1048576 : 0,
            cpu_absolute: running ? 12.4 : 0, disk_bytes: 248 * 1048576, network_rx_bytes: 0,
            network_tx_bytes: 0, uptime: running ? 3600000 : 0, memory_available: true, cpu_available: true },
    };
}
export function emit(server: any, event: string, ...args: any[]) {
    for (const listener of listeners) listener(server.uuid, event, args);
}
export function power(server: any, action: string) {
    if (['starting', 'stopping'].includes(server.power)) return;
    if (!['start', 'stop', 'restart', 'kill'].includes(action)) throw new Error('Unsupported sample power action');
    if (action === 'start' && server.power === 'running') return;
    server.power = action === 'stop' || action === 'kill' ? 'stopping' : 'starting';
    emit(server, 'status', server.power);
    emit(server, 'console output', `[DEMO] ${action} requested. No process is executed.`);
    setTimeout(() => {
        server.power = action === 'stop' || action === 'kill' ? 'offline' : 'running';
        emit(server, 'status', server.power);
        emit(server, 'console output', `[DEMO] ${server.name} is ${server.power}.`);
        emit(server, 'stats', JSON.stringify({ ...stats(server).resources, state: server.power, metrics_scope: 'sample-data' }));
    }, 650);
}
export function command(server: any, input: string) {
    if (server.power !== 'running') return;
    emit(server, 'console output', `> ${input.slice(0, 500)}`);
    const text = input.trim();
    const reply = text === 'help' ? 'Demo commands: help, list, status, echo <message>, stop.' :
        text === 'list' ? '3 sample players: Fariz, Alex, Steve. No real players are connected.' :
        text === 'status' ? `${server.name}: ${server.power} (simulated).` :
        text.startsWith('echo ') ? text.slice(5) : 'Command acknowledged in the demo. No shell is executed.';
    emit(server, 'console output', reply);
    if (text === 'stop') power(server, 'stop');
}
export const files: Record<string, Record<string, string | null>> = {};
for (const server of servers) files[server.uuid] = {
    '/logs': null,
    '/logs/latest.log': '[DEMO] Native runtime ready.\n[DEMO] Sample output only.\n',
    '/README.txt': 'FDevPanel interactive preview.\nThese are sample files. Edits stay in this session.\n',
    '/server.properties': 'motd=Welcome to FDevPanel\nmax-players=20\nview-distance=8\n',
    '/main.py': 'print("Hello from FDevPanel!")\n',
};
const schedules: Record<string, any[]> = {};
const backups: Record<string, any[]> = {};
export function list(data: any[] = []) {
    return { object: 'list', data, meta: { pagination: { total: data.length, count: data.length, per_page: 50, current_page: 1, total_pages: 1 }, backup_count: data.length } };
}
const object = (type: string, attributes: any, meta: any = {}) => ({ object: type, attributes, meta });
const filepath = (root: string, name: string) => ('/'+root+'/'+name).replace(/\/+/g, '/');

export function respond(url: string, method = 'get', body: any = {}, params: any = {}): any {
    const parsed = new URL(url, 'https://demo.invalid');
    if (parsed.origin !== 'https://demo.invalid') throw new Error('External API requests are blocked in this demo');
    const path = parsed.pathname;
    const query = { ...Object.fromEntries(parsed.searchParams), ...params };
    if (path === '/api/client') {
        const filter = String(query['filter[*]'] || '').toLowerCase();
        return list(servers.filter(s => (s.name+' '+s.description).toLowerCase().includes(filter)).map(s => object('server', s)));
    }
    if (path === '/api/client/permissions') return { attributes: { permissions: { control: { description: 'Demo controls', keys: { console: 'Console', start: 'Start', stop: 'Stop', restart: 'Restart' } } } } };
    if (path.startsWith('/api/client/account')) {
        if (method === 'get') return list();
        if (path.endsWith('/api-keys')) return { attributes: { identifier: 'demo-key', description: body.description, allowed_ips: [], created_at: timestamp }, meta: { secret_token: 'DEMO_NOT_A_REAL_API_KEY' } };
        return { attributes: {}, data: [] };
    }
    if (path === '/auth/logout' || path === '/sanctum/csrf-cookie') return {};
    const match = path.match(/^\/api\/client\/servers\/([^/]+)(.*)$/);
    if (!match) throw new Error('This operation is not available in the static demo');
    const server = findServer(match[1]);
    const route = match[2];
    if (!route) return object('server', server, { is_server_owner: true, user_permissions: ['*'] });
    if (route === '/resources') return object('stats', stats(server));
    if (route === '/websocket') return { data: { token: 'DEMO_NOT_A_TOKEN', socket: 'demo:'+server.uuid } };
    if (route === '/power') { power(server, body.signal); return {}; }
    if (route === '/command') { command(server, body.command); return {}; }
    if (route === '/startup') return { ...server.relationships.variables, meta: { startup_command: server.invocation, docker_images: {} } };
    if (route === '/startup/variable') {
        const variable = server.relationships.variables.data.find((v: any) => v.attributes.env_variable === body.key);
        if (!variable || typeof body.value !== 'string' || !body.value.trim() || body.value.length > 128) throw new Error('Enter a sample value between 1 and 128 characters');
        if (body.key === 'JAVA_VERSION' && !['17', '21', '25'].includes(body.value)) throw new Error('Choose Java 17, 21, or 25');
        variable.attributes.server_value = body.value;
        return { ...variable, meta: { startup_command: server.invocation } };
    }
    if (route.startsWith('/files/')) {
        const fs = files[server.uuid];
        const directory = String(query.directory || body.root || '/').replace(/\/$/, '') || '/';
        if (route === '/files/list') return list(Object.entries(fs).filter(([name]) => {
            const prefix = directory === '/' ? '/' : directory+'/';
            return name.startsWith(prefix) && !name.slice(prefix.length).includes('/');
        }).map(([name, content]) => object('file_object', { name: name.split('/').pop(), mode: '-rw-r--r--', mode_bits: '0644', size: content?.length || 0, is_file: content !== null, is_symlink: false, mimetype: content === null ? 'inode/directory' : 'text/plain', created_at: timestamp, modified_at: timestamp })));
        if (route === '/files/contents') { const value = fs[String(query.file)]; if (typeof value !== 'string') throw new Error('Sample file not found'); return value; }
        if (route === '/files/write') { fs[String(query.file)] = String(body); return {}; }
        if (route === '/files/create-folder') { fs[filepath(body.root, body.name)] = null; return {}; }
        if (route === '/files/delete') { for (const name of body.files || []) { const prefix = filepath(body.root, name); for (const key of Object.keys(fs)) if (key === prefix || key.startsWith(prefix+'/')) delete fs[key]; } return {}; }
        if (route === '/files/rename') {
            for (const item of body.files || []) {
                if (!item.to || item.to.includes('/') || item.to.includes('..')) throw new Error('Use a simple sample filename');
                const before = filepath(body.root, item.from); const after = filepath(body.root, item.to);
                if (!(before in fs) || after in fs) throw new Error('Sample file missing or destination exists');
                for (const key of Object.keys(fs)) if (key === before || key.startsWith(before+'/')) { fs[after+key.slice(before.length)] = fs[key]; delete fs[key]; }
            }
            return {};
        }
        if (route === '/files/copy') { const from = filepath(body.root, body.location); fs[from+'.copy'] = fs[from]; return {}; }
        throw new Error('This file operation needs a real server and is disabled in the demo');
    }
    if (route === '/network/allocations') return server.relationships.allocations;
    if (route.match(/^\/network\/allocations\/\d+$/)) {
        const allocation = server.relationships.allocations.data.find((a: any) => a.attributes.id === Number(route.split('/').pop()));
        if (allocation) allocation.attributes.notes = body.notes || '';
        return allocation || {};
    }
    if (route === '/schedules' && method === 'get') return list(schedules[server.uuid] || []);
    if (route === '/schedules' && method === 'post') {
        const schedule = { id: Date.now(), name: body.name, cron: { minute: body.minute, hour: body.hour, day_of_month: body.day_of_month, month: body.month, day_of_week: body.day_of_week }, is_active: body.is_active, only_when_online: body.only_when_online, is_processing: false, last_run_at: null, next_run_at: timestamp, created_at: timestamp, updated_at: timestamp, relationships: { tasks: list() } };
        (schedules[server.uuid] ||= []).push(object('schedule', schedule));
        return object('schedule', schedule);
    }
    if (route.startsWith('/schedules/')) {
        const schedule = (schedules[server.uuid] || []).find(s => s.attributes.id === Number(route.split('/')[2]));
        if (!schedule) throw new Error('Sample schedule not found');
        if (method === 'delete') { schedules[server.uuid] = schedules[server.uuid].filter(s => s !== schedule); return {}; }
        if (route.endsWith('/execute')) { emit(server, 'console output', '[DEMO] Sample schedule executed.'); return {}; }
        return schedule;
    }
    if (route === '/backups') return list(backups[server.uuid] || []);
    if (route === '/databases' || route === '/users' || route === '/activity') return list();
    if (route === '/settings/reinstall') { emit(server, 'install output', '[DEMO] Native installation simulated; no packages are installed.'); emit(server, 'install completed'); return {}; }
    if (route === '/settings/rename') { server.name = body.name || server.name; server.description = body.description || server.description; return {}; }
    throw new Error('This operation requires a real Panel and is unavailable in demo mode');
}
