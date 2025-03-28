import {axiosInstance} from '@/lib/axios/axios';

import {PaginationRequest, PaginationResponse} from '../api.interface';
import {APIBaseService} from '../main.service';
import {IMedicalRecord} from './medical-record.interface';

export class MedicalRecordService extends APIBaseService {
    public static readonly ROUTES = {
        MEDICAL_RECORDS_DOCTOR: APIBaseService.BASE_URL + '/medical-records',
        MEDICAL_RECORDS_PATIENT: APIBaseService.BASE_URL + '/medical-records/patient',
        MEDICAL_RECORDS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/medical-records/${id}`,
    };

    public static async getMedicalRecordsDoctor(pagination?: PaginationRequest) {
        return await axiosInstance.get<PaginationResponse<IMedicalRecord[]>>(
            MedicalRecordService.ROUTES.MEDICAL_RECORDS_DOCTOR,
            {
                params: pagination,
            }
        );
    }

    public static async getMedicalRecordsPatient(pagination?: PaginationRequest) {
        return await axiosInstance.get<PaginationResponse<IMedicalRecord[]>>(
            MedicalRecordService.ROUTES.MEDICAL_RECORDS_PATIENT,
            {
                params: pagination,
            }
        );
    }

    public static async getMedicalRecordById(id: number) {
        return await axiosInstance.get<IMedicalRecord>(MedicalRecordService.ROUTES.MEDICAL_RECORDS_BY_ID(id));
    }
}
