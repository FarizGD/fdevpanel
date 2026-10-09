import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-4 cursor-pointer transition-all duration-150`};

        &:active,
        &:hover {
            ${tw`text-neutral-100 bg-black`};
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px var(--fdev-accent);
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            window.location.href = '../index.html';
        });
    };

    return (
        <div className={'fdev-navigation w-full'}>
            <a className='fdev-skip' href='#fdev-main' onClick={(event) => { event.preventDefault(); document.getElementById('fdev-main')?.scrollIntoView(); }}>
                Skip to content
            </a>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[3.5rem] max-w-[1200px]'}>
                <div id={'logo'} className={'flex-1'}>
                    <Link
                        to={'/'}
                        aria-label={name + ' workspace'}
                        className={
                            'text-2xl font-header font-medium px-4 no-underline text-neutral-200 hover:text-neutral-100 transition-colors duration-150'
                        }
                    >
                        <img src='./fdev-mark.svg' alt='' />
                        <span className='fdev-brand-short' aria-hidden='true'>
                            FDev
                        </span>
                        <span className='fdev-brand-name'>
                            {name}
                            <small>CONTROL SPACE</small>
                        </span>
                    </Link>
                </div>
                <RightNavigation
                    as='nav'
                    aria-label='Main navigation'
                    className={'flex h-full items-center justify-center'}
                >
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact aria-label={'Dashboard'}>
                            <FontAwesomeIcon icon={faLayerGroup} />
                            <span className='fdev-nav-label'>Workspace</span>
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'../index.html#features'} rel={'noreferrer'} aria-label={'Administration'}>
                                <FontAwesomeIcon icon={faCogs} />
                                <span className='fdev-nav-label'>Admin</span>
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'} aria-label={'Account settings'}>
                            <span className={'flex items-center w-5 h-5'}>
                                <Avatar.User />
                            </span>
                            <span className='fdev-nav-label'>Account</span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout} aria-label={'Sign out'}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span className='fdev-nav-label'>Sign out</span>
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </div>
    );
};
