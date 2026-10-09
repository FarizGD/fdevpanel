import React, { useRef, useState } from 'react';
import { Dialog as HDialog } from '@headlessui/react';
import { Button } from '@/components/elements/button/index';
import { XIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DialogContext, IconPosition, RenderDialogProps, styles } from './';

const variants = {
    open: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 15,
            stiffness: 300,
            duration: 0.15,
        },
    },
    closed: {
        scale: 0.75,
        opacity: 0,
        transition: {
            type: 'easeIn',
            duration: 0.15,
        },
    },
    bounce: {
        scale: 0.95,
        opacity: 1,
        transition: { type: 'linear', duration: 0.075 },
    },
};

export default ({
    open,
    title,
    description,
    onClose,
    hideCloseIcon,
    preventExternalClose,
    children,
}: RenderDialogProps) => {
    const reducedMotion = useReducedMotion();
    const container = useRef<HTMLDivElement>(null);
    const [icon, setIcon] = useState<React.ReactNode>();
    const [footer, setFooter] = useState<React.ReactNode>();
    const [iconPosition, setIconPosition] = useState<IconPosition>('title');
    const [down, setDown] = useState(false);

    const onContainerClick = (down: boolean, e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target instanceof HTMLElement && container.current?.isSameNode(e.target)) {
            setDown(down);
        }
    };

    const onDialogClose = (): void => {
        if (!preventExternalClose) {
            return onClose();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <DialogContext.Provider value={{ setIcon, setFooter, setIconPosition }}>
                    <HDialog
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.15 }}
                        open={open}
                        onClose={onDialogClose}
                    >
                        <div className={'fixed inset-0 bg-gray-900/50 z-40'} />
                        <div className={'fixed inset-0 overflow-y-auto z-50'}>
                            <div
                                ref={container}
                                className={styles.container}
                                onMouseDown={onContainerClick.bind(this, true)}
                                onMouseUp={onContainerClick.bind(this, false)}
                            >
                                <HDialog.Panel
                                    as={motion.div}
                                    initial={'closed'}
                                    animate={down ? 'bounce' : 'open'}
                                    exit={'closed'}
                                    variants={
                                        reducedMotion
                                            ? {
                                                  open: { opacity: 1, scale: 1 },
                                                  closed: { opacity: 0, scale: 1 },
                                                  bounce: { opacity: 1, scale: 1 },
                                              }
                                            : variants
                                    }
                                    className={styles.panel}
                                >
                                    <div className={'flex p-4 sm:p-6 pb-0 overflow-y-auto min-h-0'}>
                                        {iconPosition === 'container' && icon}
                                        <div className={'flex-1 min-w-0'}>
                                            <div className={'flex items-center'}>
                                                {iconPosition !== 'container' && icon}
                                                <div>
                                                    {title && (
                                                        <HDialog.Title className={styles.title}>{title}</HDialog.Title>
                                                    )}
                                                    {description && (
                                                        <HDialog.Description>{description}</HDialog.Description>
                                                    )}
                                                </div>
                                            </div>
                                            {children}
                                            <div className={'invisible h-6'} />
                                        </div>
                                    </div>
                                    {footer}
                                    {/* Keep this below the other buttons so that it isn't the default focus if they're present. */}
                                    {!hideCloseIcon && (
                                        <div className={'absolute right-0 top-0 m-1'}>
                                            <Button.Text
                                                size={Button.Sizes.Small}
                                                shape={Button.Shapes.IconSquare}
                                                onClick={onClose}
                                                className={'group'}
                                                aria-label={'Close dialog'}
                                            >
                                                <XIcon className={styles.close_icon} />
                                            </Button.Text>
                                        </div>
                                    )}
                                </HDialog.Panel>
                            </div>
                        </div>
                    </HDialog>
                </DialogContext.Provider>
            )}
        </AnimatePresence>
    );
};
