import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {GENDER} from '../auth/auth.enum';

// const schemaUpdatePatient = yup.object().shape({
//     name: yup.string().nullable().min(3, 'Name must be at least 3 characters').required('Name is required'),
//     age: yup
//         .number()
//         .nullable()
//         .positive('Age must be a positive number')
//         .integer('Age must be an integer')
//         .min(1, 'Age must be at least 1 year old')
//         .required('Age is required'),
//     gender: yup
//         .string()
//         .oneOf(Object.values(GENDER), 'Please select a valid gender')
//         .nullable()
//         .required('Gender is required'),
//     phoneNumber: yup
//         .string()
//         .nullable()
//         .matches(/^\d+$/, 'Phone number must contain only numbers')
//         .min(10, 'Phone number must be at least 10 digits')
//         .required('Phone number is required'),
//     address: yup.string().nullable().min(10, 'Address must be at least 10 characters').required('Address is required'),
// });

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
        .required('Phone number is required')
        .nullable()
        .matches(/^\+?\d+$/, 'Phone number must contain only numbers')
        .min(10, 'Phone number must be at least 10 digits'),

    address: yup.string().required('Address is required').nullable().min(10, 'Address must be at least 10 characters'),
});

export const updatePatientResolver = yupResolver(schemaUpdatePatient);
