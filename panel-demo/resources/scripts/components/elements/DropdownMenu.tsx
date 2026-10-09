import React, { createRef } from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Fade from '@/components/elements/Fade';
import { createPortal } from 'react-dom';

interface Props {
    children: React.ReactNode;
    renderToggle: (onClick: (e: React.MouseEvent<any, MouseEvent>) => void) => React.ReactChild;
}

export const DropdownButtonRow = styled.button<{ danger?: boolean }>`
    ${tw`p-2 flex items-center rounded w-full text-neutral-200`};
    transition: 150ms all ease;

    &:hover {
        ${(props) => (props.danger ? tw`text-red-700 bg-red-100` : tw`text-neutral-700 bg-neutral-100`)};
    }
`;

interface State {
    posX: number;
    posY: number;
    visible: boolean;
}

class DropdownMenu extends React.PureComponent<Props, State> {
    menu = createRef<HTMLDivElement>();

    state: State = {
        posX: 0,
        posY: 0,
        visible: false,
    };

    componentWillUnmount() {
        this.removeListeners();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        const menu = this.menu.current;

        if (this.state.visible && !prevState.visible && menu) {
            document.addEventListener('click', this.windowListener);
            document.addEventListener('contextmenu', this.contextMenuListener);
            const x = Math.max(
                8,
                Math.min(this.state.posX - menu.clientWidth, window.innerWidth - menu.clientWidth - 8)
            );
            const y = Math.max(8, Math.min(this.state.posY, window.innerHeight - menu.clientHeight - 8));
            menu.style.left = `${Math.round(x)}px`;
            menu.style.top = `${Math.round(y)}px`;
            document.addEventListener('keydown', this.keyListener);
            menu.querySelector<HTMLElement>('button, [tabindex="0"]')?.focus();
        }

        if (!this.state.visible && prevState.visible) {
            this.removeListeners();
        }
    }

    removeListeners = () => {
        document.removeEventListener('click', this.windowListener);
        document.removeEventListener('contextmenu', this.contextMenuListener);
        document.removeEventListener('keydown', this.keyListener);
    };

    onClickHandler = (e: React.MouseEvent<any, MouseEvent>) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        this.triggerMenu(rect.right, rect.bottom);
    };

    keyListener = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.setState({ visible: false });
    };

    contextMenuListener = () => this.setState({ visible: false });

    windowListener = (e: MouseEvent) => {
        const menu = this.menu.current;

        if (e.button === 2 || !this.state.visible || !menu) {
            return;
        }

        if (e.target === menu || menu.contains(e.target as Node)) {
            return;
        }

        if (e.target !== menu && !menu.contains(e.target as Node)) {
            this.setState({ visible: false });
        }
    };

    triggerMenu = (posX: number, posY = window.innerHeight / 2) =>
        this.setState((s) => ({
            posX: !s.visible ? posX : s.posX,
            posY: !s.visible ? posY : s.posY,
            visible: !s.visible,
        }));

    render() {
        return (
            <div>
                {this.props.renderToggle(this.onClickHandler)}
                {createPortal(
                    <Fade timeout={150} in={this.state.visible} unmountOnExit>
                        <div
                            ref={this.menu}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({ visible: false });
                            }}
                            style={{
                                width: '12rem',
                                maxWidth: 'calc(100vw - 16px)',
                                maxHeight: 'calc(100dvh - 16px)',
                                overflowY: 'auto',
                            }}
                            css={tw`fixed bg-neutral-800 p-2 rounded border border-neutral-700 shadow-lg text-neutral-200 z-50`}
                        >
                            {this.props.children}
                        </div>
                    </Fade>,
                    document.body
                )}
            </div>
        );
    }
}

export default DropdownMenu;
