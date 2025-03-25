import {axiosInstance} from '@/lib/axios/axios';

import {PaginationRequest, PaginationResponse} from '../api.interface';
import {APIBaseService} from '../main.service';
import {IAppointment, IAvailableDoctorRequest, ICreateAppointment} from './appointment.interface';

export class AppointmentService extends APIBaseService {
    public static readonly ROUTES = {
        APPOINTMENTS: APIBaseService.BASE_URL + '/appointments',
        APPOINTMENTS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/appointments/${id}`,
        AVAILABLE_DOCTORS: APIBaseService.BASE_URL + '/appointments/available-doctors',
    };

    public static async getAppointments(pagination?: PaginationRequest) {
        return await axiosInstance.get<PaginationResponse<IAppointment[]>>(AppointmentService.ROUTES.APPOINTMENTS, {
            params: pagination,
        });
    }

    public static async createAppointment(payload: ICreateAppointment) {
        return await axiosInstance.post<IAppointment>(AppointmentService.ROUTES.APPOINTMENTS, payload);
    }

    public static async getAvailableDoctors(payload: IAvailableDoctorRequest) {
        return await axiosInstance.get(AppointmentService.ROUTES.AVAILABLE_DOCTORS, {
            params: payload,
        });
    }
}
