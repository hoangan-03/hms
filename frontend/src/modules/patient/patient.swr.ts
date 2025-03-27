import useSWR from 'swr';

import {PaginationRequest} from '../api.interface';
import {PatientService} from './patient.service';

function useGetPatients(pagination?: PaginationRequest, shouldFetch: boolean = true) {
    const url = PatientService.ROUTES.PATIENTS;

    const {data, mutate, error, isLoading, isValidating} = useSWR(
        shouldFetch ? {...pagination, key: url} : null,
        PatientService.getPatients,
        {
            revalidateOnFocus: true,
            keepPreviousData: false,
        }
    );

    return {
        data,
        mutate,
        error,
        isLoading,
        isValidating,
    };
}

export {useGetPatients};
