import {GENDER, ROLE} from '../auth/auth.enum';
import {BaseEntity} from '../common.interface';

export interface IPatient extends BaseEntity {
    id: number;
    name: string | null;
    username: string;
    age: number | null;
    gender: GENDER | null;
    phoneNumber: string | null;
    address: string | null;
    role: ROLE;
}

export interface ICreatePatient {
    name: string;
    username: string;
    password: string;
    age?: number | null;
    gender?: GENDER | null;
    phoneNumber?: string | null;
    address?: string | null;
}

export interface IPatientInsurance extends BaseEntity {
    id: number;
    provider: string;
    policyNumber: string;
    coverage: string;
    expiryDate: string;
}

export interface IPatientBilling extends BaseEntity {
    id: number;
    amount: number;
    billingDate: string; // 'YYYY-MM-DD'
}

export interface IUpdatePatient {
    name?: string;
    age?: number;
    gender?: Exclude<GENDER, GENDER.NULL>;
    phoneNumber?: string;
    address?: string;
}
