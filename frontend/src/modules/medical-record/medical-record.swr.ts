import useSWR from 'swr';

import {PaginationRequest} from '../api.interface';
import {ROLE} from '../auth/auth.enum';
import {MedicalRecordService} from './medical-record.service';

function useGetMedicalRecords(pagination?: PaginationRequest, role: ROLE = ROLE.DOCTOR, shouldFetch: boolean = true) {
    const url =
        role === ROLE.DOCTOR
            ? MedicalRecordService.ROUTES.MEDICAL_RECORDS_DOCTOR
            : MedicalRecordService.ROUTES.MEDICAL_RECORDS_PATIENT;

    const {data, error, isLoading, isValidating, mutate} = useSWR(
        shouldFetch ? {...pagination, key: url} : null,
        role === ROLE.DOCTOR
            ? MedicalRecordService.getMedicalRecordsDoctor
            : MedicalRecordService.getMedicalRecordsPatient,
        {
            revalidateOnFocus: true,
            keepPreviousData: false,
        }
    );

    return {
        data: data?.data,
        mutate,
        error,
        isLoading,
        isValidating,
    };
}

export {useGetMedicalRecords};
