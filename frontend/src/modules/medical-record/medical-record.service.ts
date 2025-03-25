import {axiosInstance} from '@/lib/axios/axios';

import {PaginationRequest} from '../api.interface';
import {APIBaseService} from '../main.service';
import {IMedicalRecord} from './medical-record.interface';

export class MedicalRecordService extends APIBaseService {
    public static readonly ROUTES = {
        MEDICAL_RECORDS: APIBaseService.BASE_URL + '/medical-records',
        MEDICAL_RECORDS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/medical-records/${id}`,
    };

    public static async getMedicalRecords(pagination?: PaginationRequest) {
        return await axiosInstance.get<IMedicalRecord[]>(MedicalRecordService.ROUTES.MEDICAL_RECORDS, {
            params: pagination,
        });
    }

    public static async getMedicalRecordById(id: number) {
        return await axiosInstance.get<IMedicalRecord>(MedicalRecordService.ROUTES.MEDICAL_RECORDS_BY_ID(id));
    }
}
