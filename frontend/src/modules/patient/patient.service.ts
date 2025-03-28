import {axiosInstance} from '@/lib/axios/axios';

import {PaginationResponse} from '../api.interface';
import {APIBaseService} from '../main.service';
import {IPatient, IPatientBilling, IPatientInsurance, IUpdatePatient} from './patient.interface';

export class PatientService extends APIBaseService {
    public static readonly ROUTES = {
        PATIENTS: APIBaseService.BASE_URL + '/patients',
        PATIENTS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/patients/${id}`,
        INSURANCE: APIBaseService.BASE_URL + '/patients/insurance',
        BILLINGS: APIBaseService.BASE_URL + '/patients/billing',
        BILLING_BY_ID: (id: number) => APIBaseService.BASE_URL + `/patients/billing/${id}`,
        UPDATE_PATIENT: APIBaseService.BASE_URL + '/patients/profile', // might put this in auth service
        DOCTOR_UPDATE_PATIENT: (id: number) => APIBaseService.BASE_URL + `/patients/profile/doctor-update/${id}`,
    };

    public static async getPatients() {
        return await axiosInstance
            .get<PaginationResponse<IPatient[]>>(PatientService.ROUTES.PATIENTS)
            .then((res) => res.data);
    }

    public static async getPatientById(id: number) {
        return await axiosInstance.get<IPatient>(PatientService.ROUTES.PATIENTS_BY_ID(id)).then((res) => res.data);
    }

    public static async getInsurance() {
        return await axiosInstance.get<IPatientInsurance>(PatientService.ROUTES.INSURANCE).then((res) => res.data);
    }

    public static async getBillings() {
        return await axiosInstance.get<IPatientBilling[]>(PatientService.ROUTES.BILLINGS).then((res) => res.data);
    }

    public static async getBillingById(id: number) {
        return await axiosInstance
            .get<IPatientBilling>(PatientService.ROUTES.BILLING_BY_ID(id))
            .then((res) => res.data);
    }

    public static async updatePatient(payload: IUpdatePatient) {
        return await axiosInstance.patch<IPatient>(PatientService.ROUTES.UPDATE_PATIENT, payload);
    }

    public static async doctorUpdatePatient(id: number, payload: IUpdatePatient) {
        return await axiosInstance.patch<IPatient>(PatientService.ROUTES.DOCTOR_UPDATE_PATIENT(id), payload);
    }
}
