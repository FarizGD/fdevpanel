import React, { memo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/elements/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <Card className={className}>
        <CardHeader>
            {typeof title === 'string' ? (
                <p css={tw`text-sm font-medium`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-neutral-300`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

export default memo(TitledGreyBox, isEqual);
