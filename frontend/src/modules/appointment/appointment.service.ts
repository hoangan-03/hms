import {axiosInstance} from '@/lib/axios/axios';

import {PaginationRequest, PaginationResponse} from '../api.interface';
import {IDoctor} from '../doctor/doctor.interface';
import {APIBaseService} from '../main.service';
import {IAppointment, IAvailableDoctorRequest, ICreateAppointment, IUpdateAppointment} from './appointment.interface';

export class AppointmentService extends APIBaseService {
    public static readonly ROUTES = {
        APPOINTMENTS: APIBaseService.BASE_URL + '/appointments',
        APPOINTMENT_DOCTORS: APIBaseService.BASE_URL + '/appointments/doctors',
        APPOINTMENTS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/appointments/${id}`,
        AVAILABLE_DOCTORS: APIBaseService.BASE_URL + '/appointments/available-doctors',
        CANCEL: (id: number) => APIBaseService.BASE_URL + `/appointments/${id}/cancel`,
        CONFIRM: (id: number) => APIBaseService.BASE_URL + `/appointments/${id}/confirm`,
    };

    public static async getAppointments(pagination?: PaginationRequest) {
        return await axiosInstance
            .get<PaginationResponse<IAppointment[]>>(AppointmentService.ROUTES.APPOINTMENTS, {
                params: pagination,
            })
            .then((response) => response.data);
    }

    public static async getAppointmentsDoctors(pagination?: PaginationRequest) {
        return await axiosInstance
            .get<PaginationResponse<IAppointment[]>>(AppointmentService.ROUTES.APPOINTMENT_DOCTORS, {
                params: pagination,
            })
            .then((response) => response.data);
    }

    public static async createAppointment(payload: ICreateAppointment) {
        return await axiosInstance.post<IAppointment>(AppointmentService.ROUTES.APPOINTMENTS, payload);
    }

    public static async getAvailableDoctors(payload: IAvailableDoctorRequest) {
        return await axiosInstance
            .get<IDoctor[]>(AppointmentService.ROUTES.AVAILABLE_DOCTORS, {
                params: payload,
            })
            .then((response) => response.data);
    }

    public static async cancelAppointment(id: number) {
        return await axiosInstance.patch(AppointmentService.ROUTES.CANCEL(id));
    }

    public static async confirmAppointment(id: number) {
        return await axiosInstance.patch(AppointmentService.ROUTES.CONFIRM(id));
    }

    public static async updateAppointment(id: number, payload: IUpdateAppointment) {
        return await axiosInstance.patch<IAppointment>(AppointmentService.ROUTES.APPOINTMENTS_BY_ID(id), payload);
    }
}
