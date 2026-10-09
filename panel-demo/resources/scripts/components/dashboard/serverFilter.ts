import { Server } from '@/api/server/getServer';

// This searches the loaded page only; global search stays in the navigation.
export const filterServerPage = <T extends Pick<Server, 'name' | 'description'>>(items: T[], query: string): T[] => {
    const needle = query.trim().toLocaleLowerCase();
    return needle
        ? items.filter((server) => `${server.name} ${server.description}`.toLocaleLowerCase().includes(needle))
        : items;
};
