import {BaseEntity} from '../common.interface';
import {IDoctor} from '../doctor/doctor.interface';
import {IPatient} from '../patient/patient.interface';
import {APPOINTMENT_STATUS, APPOINTMENT_TIME_SLOT} from './appointment.enum';

export interface IAppointment extends BaseEntity {
    id: number;
    date: string; // 'YYYY-MM-DD'
    timeSlot: APPOINTMENT_TIME_SLOT;
    reason: string | null;
    notes: string | null;
    status: APPOINTMENT_STATUS;
    doctor: IDoctor;
    patient: IPatient;
}

export interface ICreateAppointment {
    date: string; // 'Date'
    timeSlot: APPOINTMENT_TIME_SLOT;
    doctorId: number;
    reason?: string;
    notes?: string;
}

export type IUpdateAppointment = ICreateAppointment;

export interface IAvailableDoctorRequest {
    date: string; // 'YYYY-MM-DD'
    timeSlot: APPOINTMENT_TIME_SLOT;
    departmentId?: number;
}
