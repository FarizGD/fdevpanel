import React, { useEffect, useMemo, useRef, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import tw from 'twin.macro';
import styled, { css } from 'styled-components/macro';
import { breakpoint } from '@/theme';
import Fade from '@/components/elements/Fade';
import { createPortal } from 'react-dom';
import { Dialog } from '@headlessui/react';

export interface RequiredModalProps {
    visible: boolean;
    onDismissed: () => void;
    appear?: boolean;
    top?: boolean;
}

export interface ModalProps extends RequiredModalProps {
    dismissable?: boolean;
    closeOnEscape?: boolean;
    closeOnBackground?: boolean;
    showSpinnerOverlay?: boolean;
}

export const ModalMask = styled.div`
    ${tw`fixed z-50 overflow-auto flex w-full inset-0`};
    background: rgba(0, 0, 0, 0.7);
`;

const ModalContainer = styled.div<{ alignTop?: boolean }>`
    max-width: 95%;
    max-height: calc(100vh - 24px);
    max-height: calc(100dvh - 24px);
    min-height: 0;
    padding-top: 44px;
    background: var(--fdev-surface);
    border-radius: 8px;
    ${breakpoint('md')`max-width: 75%`};
    ${breakpoint('lg')`max-width: 50%`};

    ${tw`relative flex flex-col w-full m-auto`};
    ${(props) =>
        props.alignTop &&
        css`
            margin-top: 12px;
            ${breakpoint('md')`margin-top: 48px; max-height: calc(100vh - 60px)`};
        `};

    margin-bottom: auto;

    & > .close-icon {
        ${tw`absolute right-0 p-2 text-white cursor-pointer opacity-50 transition-all duration-150 ease-linear hover:opacity-100`};
        top: 0;
        width: 44px;
        height: 44px;
        z-index: 1;

        &:hover {
            ${tw`transform rotate-90`}
        }

        & > svg {
            ${tw`w-6 h-6`};
        }
    }
`;

const Modal: React.FC<ModalProps> = ({
    visible,
    appear,
    dismissable,
    showSpinnerOverlay,
    top = true,
    closeOnBackground = true,
    closeOnEscape = true,
    onDismissed,
    children,
}) => {
    const [render, setRender] = useState(visible);

    const isDismissable = useMemo(() => {
        return (dismissable ?? true) && !(showSpinnerOverlay || false);
    }, [dismissable, showSpinnerOverlay]);

    useEffect(() => {
        if (!isDismissable || !closeOnEscape) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setRender(false);
        };

        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [isDismissable, closeOnEscape, render]);

    useEffect(() => setRender(visible), [visible]);

    return (
        <Fade in={render} timeout={150} appear={appear || true} unmountOnExit onExited={() => onDismissed()}>
            <Dialog
                as={ModalMask}
                open={render}
                static
                aria-label='Workspace dialog'
                onClose={() => {
                    if (isDismissable && closeOnEscape) setRender(false);
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (isDismissable && closeOnBackground) {
                        e.stopPropagation();
                        if (e.target === e.currentTarget) {
                            setRender(false);
                        }
                    }
                }}
            >
                <Dialog.Panel as={ModalContainer} alignTop={top}>
                    {isDismissable && (
                        <button
                            type='button'
                            aria-label='Close dialog'
                            className={'close-icon'}
                            onClick={() => setRender(false)}
                        >
                            <svg
                                xmlns={'http://www.w3.org/2000/svg'}
                                fill={'none'}
                                viewBox={'0 0 24 24'}
                                stroke={'currentColor'}
                            >
                                <path
                                    strokeLinecap={'round'}
                                    strokeLinejoin={'round'}
                                    strokeWidth={'2'}
                                    d={'M6 18L18 6M6 6l12 12'}
                                />
                            </svg>
                        </button>
                    )}
                    {showSpinnerOverlay && (
                        <Fade timeout={150} appear in>
                            <div
                                css={tw`absolute w-full h-full rounded flex items-center justify-center`}
                                style={{ background: 'hsla(211, 10%, 53%, 0.35)', zIndex: 9999 }}
                            >
                                <Spinner />
                            </div>
                        </Fade>
                    )}
                    <div
                        css={tw`bg-neutral-800 p-3 sm:p-4 md:p-6 rounded shadow-md overflow-y-auto min-h-0 transition-colors duration-150`}
                    >
                        {children}
                    </div>
                </Dialog.Panel>
            </Dialog>
        </Fade>
    );
};

const PortaledModal: React.FC<ModalProps> = ({ children, ...props }) => {
    const element = useRef(document.getElementById('modal-portal'));

    return createPortal(<Modal {...props}>{children}</Modal>, element.current!);
};

export default PortaledModal;
