import {axiosInstance} from '@/lib/axios/axios';

import {APIBaseService} from '../main.service';
import {IPatient, IPatientBilling, IPatientInsurance} from './patient.interface';

export class PatientService extends APIBaseService {
    public static readonly ROUTES = {
        PATIENTS: APIBaseService.BASE_URL + '/patients',
        PATIENTS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/patients/${id}`,
        INSURANCE: APIBaseService.BASE_URL + '/patients/insurance',
        BILLINGS: APIBaseService.BASE_URL + '/patients/billing',
        BILLING_BY_ID: (id: number) => APIBaseService.BASE_URL + `/patients/billing/${id}`,
    };

    public static async getPatients() {
        return await axiosInstance.get<IPatient[]>(PatientService.ROUTES.PATIENTS);
    }

    public static async getPatientById(id: number) {
        return await axiosInstance.get<IPatient>(PatientService.ROUTES.PATIENTS_BY_ID(id));
    }

    public static async getInsurance() {
        return await axiosInstance.get<IPatientInsurance>(PatientService.ROUTES.INSURANCE);
    }

    public static async getBillings() {
        return await axiosInstance.get<IPatientBilling[]>(PatientService.ROUTES.BILLINGS);
    }

    public static async getBillingById(id: number) {
        return await axiosInstance.get<IPatientBilling>(PatientService.ROUTES.BILLING_BY_ID(id));
    }
}
