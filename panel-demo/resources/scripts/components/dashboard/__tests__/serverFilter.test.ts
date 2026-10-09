import { filterServerPage } from '../serverFilter';
const servers = [
    { name: 'Paper World', description: 'Friends and building' },
    { name: 'Python Bot', description: 'Scheduled jobs' },
];
test('filters the loaded page by name or description without mutating server order', () => {
    expect(filterServerPage(servers, '  PAPER ')).toEqual([servers[0]]);
    expect(filterServerPage(servers, 'JOBS')).toEqual([servers[1]]);
    expect(filterServerPage(servers, '')).toBe(servers);
    expect(filterServerPage(servers, 'missing')).toEqual([]);
    expect(servers).toHaveLength(2);
});
