import React, { useContext } from 'react';
import { DialogContext } from './';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';

export default ({ children }: { children: React.ReactNode }) => {
    const { setFooter } = useContext(DialogContext);

    useDeepCompareEffect(() => {
        setFooter(
            <div
                className={
                    'px-4 sm:px-6 py-3 bg-gray-700 flex flex-wrap flex-shrink-0 gap-2 items-center justify-end rounded-b'
                }
            >
                {children}
            </div>
        );
    }, [children]);

    return null;
};
