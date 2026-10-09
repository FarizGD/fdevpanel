import React from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import classNames from 'classnames';

interface Props {
    cron: Schedule['cron'];
    className?: string;
}

const ScheduleCronRow = ({ cron, className }: Props) => (
    <div className={classNames('grid grid-cols-3 sm:flex gap-3', className)}>
        <div className={'min-w-0 text-center break-all'}>
            <p className={'font-medium'}>{cron.minute}</p>
            <p className={'text-2xs text-neutral-500 uppercase'}>Minute</p>
        </div>
        <div className={'min-w-0 text-center break-all'}>
            <p className={'font-medium'}>{cron.hour}</p>
            <p className={'text-2xs text-neutral-500 uppercase'}>Hour</p>
        </div>
        <div className={'min-w-0 text-center break-all'}>
            <p className={'font-medium'}>{cron.dayOfMonth}</p>
            <p className={'text-2xs text-neutral-500 uppercase'}>Day (Month)</p>
        </div>
        <div className={'min-w-0 text-center break-all'}>
            <p className={'font-medium'}>{cron.month}</p>
            <p className={'text-2xs text-neutral-500 uppercase'}>Month</p>
        </div>
        <div className={'min-w-0 text-center break-all'}>
            <p className={'font-medium'}>{cron.dayOfWeek}</p>
            <p className={'text-2xs text-neutral-500 uppercase'}>Day (Week)</p>
        </div>
    </div>
);

export default ScheduleCronRow;
