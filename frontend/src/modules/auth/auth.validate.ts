import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schemaSignIn = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

export const signInResolver = yupResolver(schemaSignIn);
