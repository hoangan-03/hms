import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schemaLogin = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

const schemaRegister = yup.object().shape({
    username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const LoginResolver = yupResolver(schemaLogin);
export const RegisterResolver = yupResolver(schemaRegister);
