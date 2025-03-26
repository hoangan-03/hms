import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schemaSignIn = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

export const signInResolver = yupResolver(schemaSignIn);
