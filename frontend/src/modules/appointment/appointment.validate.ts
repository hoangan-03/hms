import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {ROLE} from '../auth/auth.enum';
import {APPOINTMENT_TIME_SLOT} from './appointment.enum';

const schemaCreateAppointment = yup.object().shape({
    date: yup.date().required('Date is required'),
    timeSlot: yup
        .string()
        .oneOf(Object.values(APPOINTMENT_TIME_SLOT), 'Please select a valid time slot')
        .required('Time is required'),
    // timeSlot: yup.enum()
    // doctor: yup.number(),
    doctor: yup
        .object()
        .nullable()
        .shape({
            id: yup.number().required('Doctor ID is required'),
            name: yup.string().required('Doctor name is required'),
            username: yup.string().required('Doctor username is required'),
            phoneNumber: yup.string().required('Doctor phone number is required'),
            role: yup
                .string()
                .oneOf(Object.values(ROLE), 'Please select a valid role')
                .required('Doctor role is required'),
            createdAt: yup.string().required('Doctor created at is required'),
            updatedAt: yup.string().required('Doctor updated at is required'),
        }),
    reason: yup.string(),
    notes: yup.string(),
});

export const createAppointmentResolver = yupResolver(schemaCreateAppointment);
