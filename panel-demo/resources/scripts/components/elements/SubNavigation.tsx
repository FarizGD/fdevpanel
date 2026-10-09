import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div.attrs({ className: 'fdev-subnavigation' })`
    ${tw`w-full overflow-x-auto`};
    background: var(--fdev-input);
    border-bottom: 1px solid var(--fdev-border);
    overscroll-behavior-x: contain;
    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;
        & > a,
        & > div {
            ${tw`inline-flex items-center py-3 px-4 text-neutral-300 no-underline whitespace-nowrap transition-colors duration-150`};
            min-height: 44px;
            flex-shrink: 0;
            &:hover,
            &:active,
            &.active {
                color: var(--fdev-text);
            }
            &.active {
                box-shadow: inset 0 -2px var(--fdev-blue);
            }
        }
    }
`;
export default SubNavigation;
