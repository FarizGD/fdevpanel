import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { Link, useLocation } from 'react-router-dom';
import { filterServerPage } from './serverFilter';

export default () => {
    const { search } = useLocation();
    const [filter, setFilter] = useState('');
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        // Static demo keeps the GitHub Pages base path and hash navigation intact.
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={'Servers'} showFlashKey={'dashboard'}>
            <section className='fdev-launchpad' aria-labelledby='launchpad-title'>
                <div className='fdev-launchpad-copy'>
                    <span className='fdev-kicker'>FDEV / YOUR CONTROL SPACE</span>
                    <h1 id='launchpad-title'>
                        Small screen.
                        <br />
                        <em>Big possibilities.</em>
                    </h1>
                    <p>Bring your ideas online. Your servers, terminals, and files are right here.</p>
                    <div className='fdev-hero-actions'>
                        <Link to='/account' className='fdev-action-link'>
                            Account settings <span aria-hidden='true'>&rarr;</span>
                        </Link>
                        {rootAdmin && (
                            <a href='../index.html#features' className='fdev-action-link fdev-action-primary'>
                                Create server <span aria-hidden='true'>+</span>
                            </a>
                        )}
                    </div>
                </div>
                <img className='fdev-orbit' src='./fdev-orbit.svg' alt='' />
            </section>
            <dl className='fdev-summary-strip'>
                <div>
                    <dt>Servers in this collection</dt>
                    <dd>{servers ? servers.pagination.total : '—'}</dd>
                </div>
                <div>
                    <dt>On this page</dt>
                    <dd>{servers ? servers.items.length : '—'}</dd>
                </div>
                <div>
                    <dt>Workspace access</dt>
                    <dd className='fdev-summary-text'>{rootAdmin ? 'Administrator' : 'Member'}</dd>
                </div>
            </dl>
            <div className='fdev-collection-toolbar'>
                <div>
                    <span className='fdev-kicker'>01 / COLLECTION</span>
                    <h2>Your servers</h2>
                </div>
                <div className='fdev-collection-tools'>
                    <label className='fdev-filter-label' htmlFor='server-page-filter'>
                        <span className='sr-only'>Filter servers on this page</span>
                        <input
                            id='server-page-filter'
                            type='search'
                            value={filter}
                            onChange={(event) => setFilter(event.currentTarget.value)}
                            placeholder='Filter this page…'
                        />
                    </label>
                    {rootAdmin && (
                        <Switch
                            name='show_all_servers'
                            label={showOnlyAdmin ? "Others' servers" : 'My servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin((value) => !value)}
                        />
                    )}
                </div>
            </div>
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) => {
                        const visible = filterServerPage(items, filter);
                        return visible.length ? (
                            <div className='fdev-server-collection'>
                                {visible.map((server) => (
                                    <ServerRow key={server.uuid} server={server} />
                                ))}
                            </div>
                        ) : (
                            <div className='fdev-empty-state' role='status'>
                                <span className='fdev-empty-glyph' aria-hidden='true'>
                                    [ ]
                                </span>
                                <h3>{filter.trim() ? 'No matching servers on this page' : 'A fresh space to begin'}</h3>
                                <p>
                                    {filter.trim()
                                        ? 'Try another name, clear the filter, or use global search in the navigation.'
                                        : showOnlyAdmin
                                        ? 'There are no other servers to display.'
                                        : 'No servers are associated with your account yet.'}
                                </p>
                                {filter.trim() && (
                                    <button className='fdev-action-link' type='button' onClick={() => setFilter('')}>
                                        Clear filter
                                    </button>
                                )}
                                {!filter.trim() && rootAdmin && (
                                    <a className='fdev-action-link' href='../index.html#features'>
                                        Create your first server &rarr;
                                    </a>
                                )}
                            </div>
                        );
                    }}
                </Pagination>
            )}
        </PageContentBlock>
    );
};
