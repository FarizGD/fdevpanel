import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} · FDev-VSC`;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer as='main' id='fdev-main' tabIndex={-1} css={tw`my-4 sm:my-6`} className={className}>
                    {title && (
                        <div className='fdev-titlebar'>
                            <span className='fdev-dot' aria-hidden='true' />
                            <span>FDEV</span>
                            <span aria-hidden='true'>/</span>
                            <strong>{title}</strong>
                        </div>
                    )}
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`mb-4`}>
                    <div className='fdev-page-footer'>
                        <span>FDev-VSC workspace</span>
                        <p css={tw`text-neutral-400 text-xs`}>
                            <a
                                rel={'noopener nofollow noreferrer'}
                                href={'https://pterodactyl.io'}
                                target={'_blank'}
                                css={tw`no-underline text-neutral-500 hover:text-neutral-300`}
                            >
                                Pterodactyl&reg;
                            </a>
                            &nbsp;&copy; 2015 - {new Date().getFullYear()}
                        </p>
                    </div>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
