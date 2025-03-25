import {GENDER, ROLE} from '../auth/auth.enum';
import {BaseEntity} from '../common.interface';

export interface IPatient extends BaseEntity {
    id: number;
    name: string;
    username: string;
    age: number;
    gender: GENDER;
    phoneNumber: string;
    address: string;
    role: ROLE;
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
