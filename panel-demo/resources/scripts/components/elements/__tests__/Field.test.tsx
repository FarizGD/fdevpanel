import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Formik } from 'formik';
import Field from '@/components/elements/Field';

jest.mock('uuid', () => {
    let sequence = 0;
    return { v4: () => `fixture-${++sequence}` };
});

test('repeated fields receive distinct IDs and associated labels', () => {
    const html = renderToStaticMarkup(
        <Formik initialValues={{ email: '' }} onSubmit={() => undefined}>
            <div>
                <Field name='email' label='First email' />
                <Field name='email' label='Second email' />
            </div>
        </Formik>
    );
    const ids = [...html.matchAll(/<input[^>]*\sid="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    ids.forEach((id) => expect(html).toContain(`for="${id}"`));
});

test('validation errors are linked to the input and announced', () => {
    const html = renderToStaticMarkup(
        <Formik
            initialValues={{ email: '' }}
            initialErrors={{ email: 'Please enter an email.' }}
            initialTouched={{ email: true }}
            onSubmit={() => undefined}
        >
            <Field id='contact-email' name='email' label='Email' description='Help text' />
        </Formik>
    );
    expect(html).toContain('id="contact-email"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="contact-email-help"');
    expect(html).toContain('id="contact-email-help"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('Please enter an email.');
});
