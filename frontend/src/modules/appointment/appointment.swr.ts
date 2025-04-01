import useSWR from 'swr';

import {PaginationRequest} from '../api.interface';
import {IAvailableDoctorRequest} from './appointment.interface';
import {AppointmentService} from './appointment.service';

function useGetAppointments(pagination?: PaginationRequest, shouldFetch = true) {
    const url = AppointmentService.ROUTES.APPOINTMENTS;

    const {data, mutate, error, isLoading, isValidating} = useSWR(
        shouldFetch ? {...pagination, key: url} : null,
        AppointmentService.getAppointments,
        {
            revalidateOnFocus: true,
            keepPreviousData: false,
        }
    );

    return {
        data: data,
        mutate,
        error,
        isLoading,
        isValidating,
    };
}

function useGetAvailableDoctors(payload: IAvailableDoctorRequest, shouldFetch = true) {
    const url = AppointmentService.ROUTES.AVAILABLE_DOCTORS;

    console.log('payload', payload);

    const {data, mutate, error, isLoading, isValidating} = useSWR(
        shouldFetch ? {...payload, key: url} : null,
        AppointmentService.getAvailableDoctors,
        {
            revalidateOnFocus: true,
            keepPreviousData: false,
        }
    );

    return {
        data: data || [],
        mutate,
        error,
        isLoading,
        isValidating,
    };
}

export {useGetAppointments, useGetAvailableDoctors};
