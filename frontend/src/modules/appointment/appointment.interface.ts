import {BaseEntity} from '../common.interface';
import {APPOINTMENT_STATUS, APPOINTMENT_TIME_SLOT} from './appointment.enum';

export interface IAppointment extends BaseEntity {
    id: number;
    date: string; // 'YYYY-MM-DD'
    timeSlot: APPOINTMENT_TIME_SLOT;
    reason: string;
    notes: string;
    status: APPOINTMENT_STATUS;
}

export interface ICreateAppointment {
    date: string; // 'Date'
    timeSlot: APPOINTMENT_TIME_SLOT;
    doctorId: number;
    reason?: string;
    notes?: string;
}

export interface IAvailableDoctorRequest {
    date: string; // 'YYYY-MM-DD'
    timeSlot: APPOINTMENT_TIME_SLOT;
    departmentId?: number;
}
