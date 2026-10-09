import React, { forwardRef, useMemo } from 'react';
import { v4 } from 'uuid';
import { Field as FormikField, FieldProps } from 'formik';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';

interface OwnProps {
    name: string;
    light?: boolean;
    label?: string;
    description?: string;
    validate?: (value: any) => undefined | string | Promise<any>;
}

type Props = OwnProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;

const Field = forwardRef<HTMLInputElement, Props>(
    ({ id, name, light = false, label, description, validate, ...props }, ref) => {
        const inputId = useMemo(() => id || `fdev-field-${v4()}`, [id]);
        return (
            <FormikField innerRef={ref} name={name} validate={validate}>
                {({ field, form: { errors, touched } }: FieldProps) => (
                    <div>
                        {label && (
                            <Label htmlFor={inputId} isLight={light}>
                                {label}
                            </Label>
                        )}
                        <Input
                            id={inputId}
                            {...field}
                            {...props}
                            aria-invalid={!!(touched[field.name] && errors[field.name]) || undefined}
                            aria-describedby={
                                description || (touched[field.name] && errors[field.name])
                                    ? `${inputId}-help`
                                    : props['aria-describedby']
                            }
                            isLight={light}
                            hasError={!!(touched[field.name] && errors[field.name])}
                        />
                        {touched[field.name] && errors[field.name] ? (
                            <p id={`${inputId}-help`} className={'input-help error'} role='alert'>
                                {(errors[field.name] as string).charAt(0).toUpperCase() +
                                    (errors[field.name] as string).slice(1)}
                            </p>
                        ) : description ? (
                            <p id={`${inputId}-help`} className={'input-help'}>
                                {description}
                            </p>
                        ) : null}
                    </div>
                )}
            </FormikField>
        );
    }
);
Field.displayName = 'Field';

export default Field;
