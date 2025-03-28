import {BaseEntity} from '../common.interface';
import {IDoctor} from '../doctor/doctor.interface';
import {IPatient} from '../patient/patient.interface';

export interface IPrescription extends BaseEntity {
    id: number;
    medication: string;
    dosage: string;
}

export interface IMedicalRecord extends BaseEntity {
    id: number;
    diagnosis: string;
    recordDate: string; // 'YYYY-MM-DD'
    doctor: IDoctor;
    patient: IPatient;
    prescriptions: IPrescription[];
}
