import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Formik } from 'formik';
import LoginFormContainer from '../LoginFormContainer';

jest.mock('easy-peasy', () => ({ useStoreState: () => 'FDev' }));
jest.mock('@/components/FlashMessageRender', () => () => null);

test('caller flex classes cannot put authentication fields into a horizontal row', () => {
    const html = renderToStaticMarkup(
        <Formik initialValues={{}} onSubmit={() => undefined}>
            <LoginFormContainer className='flex' title='Sign in'>
                <input name='username' /><input name='password' />
            </LoginFormContainer>
        </Formik>
    );
    expect(html).toMatch(/<form[^>]*style="[^"]*display:block/);
    expect(html).toContain('name="username"');
    expect(html).toContain('name="password"');
});
