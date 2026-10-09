import React, { useEffect } from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import VariableBox from '@/components/server/startup/VariableBox';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import getServerStartup from '@/api/swr/getServerStartup';
import Spinner from '@/components/elements/Spinner';
import { ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import isEqual from 'react-fast-compare';

const StartupContainer = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const variables = ServerContext.useStoreState(
        ({ server }) => ({
            variables: server.data!.variables,
            invocation: server.data!.invocation,
            dockerImage: server.data!.dockerImage,
        }),
        isEqual
    );

    const { data, error, isValidating, mutate } = getServerStartup(uuid, {
        ...variables,
        dockerImages: { [variables.dockerImage]: variables.dockerImage },
    });

    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);
    useEffect(() => {
        // Since we're passing in initial data this will not trigger on mount automatically. We
        // want to always fetch fresh information from the API however when we're loading the startup
        // information.
        mutate();
    }, []);

    useDeepCompareEffect(() => {
        if (!data) return;

        setServerFromState((s) => ({
            ...s,
            invocation: data.invocation,
            variables: data.variables,
        }));
    }, [data]);

    return !data ? (
        !error || (error && isValidating) ? (
            <Spinner centered size={Spinner.Size.LARGE} />
        ) : (
            <ServerError title={'Oops!'} message={httpErrorToHuman(error)} onRetry={() => mutate()} />
        )
    ) : (
        <ServerContentBlock title={'Startup Settings'} showFlashKey={'startup:image'}>
            <div css={tw`md:flex`}>
                <TitledGreyBox title={'Startup Command'} css={tw`flex-1`}>
                    <div css={tw`px-1 py-2`}>
                        <p css={tw`font-mono bg-neutral-900 rounded py-2 px-4`}>{data.invocation}</p>
                    </div>
                </TitledGreyBox>
                <TitledGreyBox title={'Native runtime'} css={tw`flex-1 md:ml-4 mt-4 md:mt-0`}>
                    <p>Termux · shared user permissions</p>
                    <p css={tw`text-sm text-neutral-300 mt-2`}>
                        Memory is a runtime hint. CPU, swap, network, and total memory limits are not enforced. Use a
                        native egg.
                    </p>
                </TitledGreyBox>
            </div>
            <h3 css={tw`mt-8 mb-2 text-2xl`}>Variables</h3>
            <div css={tw`grid gap-8 md:grid-cols-2`}>
                {data.variables.map((variable) => (
                    <VariableBox key={variable.envVariable} variable={variable} />
                ))}
            </div>
        </ServerContentBlock>
    );
};

export default StartupContainer;
