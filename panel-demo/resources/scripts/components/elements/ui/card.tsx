// Adapted from shadcn/ui's MIT-licensed Card primitives for React 16/Tailwind 3.
// Source: https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx
// Copyright (c) 2023 shadcn. See LICENSE.shadcn in this directory.
import * as React from 'react';
import cn from 'classnames';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='card' className={cn('fdev-card flex flex-col', className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='card-header' className={cn('fdev-card-header', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='card-content' className={cn('fdev-card-body', className)} {...props} />;
}

export { Card, CardHeader, CardContent };
