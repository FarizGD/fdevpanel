import React, { forwardRef } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import { useStoreState } from 'easy-peasy';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const LoginFormContainer = forwardRef<HTMLFormElement, Props>(({ title, children, ...props }, ref) => {
    const name = useStoreState((state) => state.settings.data?.name || 'FDev-VSC');
    return (
        <main className='fdev-auth' id='fdev-main' tabIndex={-1}>
            <div className='fdev-auth-card'>
                <aside className='fdev-auth-brand' aria-label='Workspace introduction'>
                    <img src='./fdev-mark.svg' alt='' />
                    <span className='fdev-kicker'>WELCOME TO YOUR CONTROL SPACE</span>
                    <h1>{name}</h1>
                    <p>A place for your next idea. Start a server, follow the logs, and make something yours.</p>
                    <img className='fdev-auth-orbit' src='./fdev-orbit.svg' alt='' />
                    <span>YOUR IDEAS / YOUR SPACE</span>
                </aside>
                <div className='fdev-auth-form'>
                    {title && <h2>{title}</h2>}
                    <FlashMessageRender />
                    <Form {...props} ref={ref} style={{ ...props.style, display: 'block', width: '100%' }}>
                        {children}
                    </Form>
                </div>
            </div>
            <p className='text-center text-neutral-400 text-xs mt-6'>
                Powered by{' '}
                <a rel='noopener noreferrer' href='https://pterodactyl.io' target='_blank'>
                    Pterodactyl Software
                </a>{' '}
                &copy; 2015 &ndash; {new Date().getFullYear()}
            </p>
        </main>
    );
});
LoginFormContainer.displayName = 'LoginFormContainer';
export default LoginFormContainer;
