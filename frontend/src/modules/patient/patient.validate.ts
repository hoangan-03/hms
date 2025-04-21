import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {GENDER} from '../auth/auth.enum';

const schemaUpdatePatient = yup.object().shape({
    id: yup.number().required('ID is required'),
    name: yup.string().required('Name is required').nullable().min(3, 'Name must be at least 3 characters'),

    age: yup
        .number()
        .required('Age is required')
        .nullable()
        .positive('Age must be a positive number')
        .integer('Age must be an integer')
        .min(1, 'Age must be at least 1 year old'),

    gender: yup
        .string()
        .required('Gender must be specified')
        .nullable()
        .oneOf(Object.values(GENDER), 'Please select a valid gender')
        .test('required-check', 'Gender must be specified', (value) => value !== null),

    phoneNumber: yup
        .string()
        .nullable()
        .matches(/^\+?\d+$/, 'Phone number must contain only numbers')
        .min(10, 'Phone number must be at least 10 digits'),

    address: yup.string().nullable(),
});

export const updatePatientResolver = yupResolver(schemaUpdatePatient);

const schemaCreatePatient = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),

    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),

    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must include uppercase, lowercase, number and special character'
        ),

    age: yup
        .number()
        .nullable()
        .transform((value) => (isNaN(value) ? null : value))
        .positive('Age must be a positive number')
        .integer('Age must be an integer')
        .min(1, 'Age must be at least 1 year old'),

    gender: yup
        .string()
        .nullable()
        .oneOf([...Object.values(GENDER)], 'Please select a valid gender'),

    phoneNumber: yup
        .string()
        .nullable()
        .matches(/^\+?\d+$/, 'Phone number must contain only numbers')
        .min(10, 'Phone number must be at least 10 digits'),

    address: yup.string().nullable(),
});

export const createPatientResolver = yupResolver(schemaCreatePatient);
