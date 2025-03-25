import {GENDER, ROLE} from './auth.enum';

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface IRegisterRequest {
    username: string;
    password: string;
}

export interface IRegisterResponse {
    username: string;
}

export interface IAuthToken {
    access_token: string;
    refresh_token: string;
}

export interface IProfile {
    id: number;
    name: string;
    username: string;
    age: number;
    gender: GENDER;
    phoneNumber: string;
    address: string;
    role: ROLE;
}
