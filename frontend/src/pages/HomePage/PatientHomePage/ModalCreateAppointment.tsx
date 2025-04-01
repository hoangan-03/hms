import {useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {DatePicker} from '@/components/common';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@/components/ui';
import {timeZoneOptions} from '@/constants/dateTime';
import {formatAppointmentTime, formatDate} from '@/lib/utils';
import {APPOINTMENT_TIME_SLOT} from '@/modules/appointment/appointment.enum';
import {ICreateAppointment} from '@/modules/appointment/appointment.interface';
import {AppointmentService} from '@/modules/appointment/appointment.service';
import {useGetAvailableDoctors} from '@/modules/appointment/appointment.swr';
import {createAppointmentResolver} from '@/modules/appointment/appointment.validate';
import {IDoctor} from '@/modules/doctor/doctor.interface';

interface Props {
    open: boolean;
    autoFocus?: boolean;
    onClose: () => void;
    onSuccessfulSubmit: () => void;
}

const timeSlots = Object.values(APPOINTMENT_TIME_SLOT);

const today = new Date(new Intl.DateTimeFormat('en-US', timeZoneOptions).format(new Date()));

type FormValues = {
    date: Date;
    timeSlot: APPOINTMENT_TIME_SLOT;
    doctor: IDoctor | null;
    reason?: string;
    notes?: string;
};

function ModalCreateAppointment({open, onClose, autoFocus, onSuccessfulSubmit}: Props) {
    const {
        handleSubmit,
        control,
        watch,
        formState: {errors, isSubmitting, isDirty},
        reset,
    } = useForm<FormValues>({
        resolver: createAppointmentResolver,
        defaultValues: {
            date: today,
            timeSlot: timeSlots[Math.min(23, Math.max(0, Number(formatDate(today).time.substring(0, 2))))],
            doctor: null,
            reason: '',
            notes: '',
        },
    });

    const {data: doctors} = useGetAvailableDoctors({
        date: formatDate(watch('date'), {dateKind: 'YYYY-MM-DD', dateDelimiter: '-'}).day,
        timeSlot: watch('timeSlot'),
    });

    useEffect(() => {
        return () => {
            if (open) reset();
        };
    }, [open, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const payload: ICreateAppointment = {
                date: formatDate(data.date, {dateKind: 'YYYY-MM-DD', dateDelimiter: '-'}).day,
                timeSlot: data.timeSlot,
                doctorId: data.doctor?.id || 0,
                ...(data.reason && {reason: data.reason}),
                ...(data.notes && {notes: data.notes}),
            };
            console.log('payload', payload);
            // await AppointmentService.createAppointment(payload);
            // toast.success('Appointment created successfully');
            // onSuccessfulSubmit();
            // onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create appointment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[600px]' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle>Create Appointment</DialogTitle>
                    <DialogDescription>Please choose the appropriate time and doctor</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='flex items-center justify-between gap-8'>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Date</Label>
                            <Controller
                                control={control}
                                name='date'
                                render={({field: {onChange, value}}) => (
                                    <DatePicker currentDate={value} setCurrentDate={onChange} minDate={today} />
                                )}
                            />
                        </div>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Time</Label>
                            <Controller
                                control={control}
                                name='timeSlot'
                                render={({field: {onChange, value}}) => (
                                    <Select onValueChange={onChange} value={value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={formatAppointmentTime(value || timeSlots[0])} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {timeSlots.map((item, index) => (
                                                    <SelectItem key={index} value={item}>
                                                        {formatAppointmentTime(item)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className='flex gap-4 space-y-2'>
                        <Label>Doctor</Label>
                        <Controller
                            control={control}
                            name='doctor'
                            render={({field: {onChange, value}}) => (
                                <div className='flex items-center gap-4'>
                                    <Select
                                        onValueChange={(doctorId) => {
                                            const selectedDoctor = doctors.find((doc) => doc.id === parseInt(doctorId));
                                            onChange(selectedDoctor);
                                        }}
                                        value={value?.id?.toString()}
                                        disabled={doctors.length <= 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={doctors.length > 0 ? 'Select a doctor' : '--'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {doctors.length > 0 &&
                                                    doctors.map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className='text-error'>{errors.doctor?.message}</p>
                                </div>
                            )}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label>Reason</Label>
                        <Controller
                            control={control}
                            name='reason'
                            render={({field}) => (
                                <Textarea
                                    errorMessage={errors.reason?.message}
                                    {...field}
                                    className='max-h-32 min-h-20'
                                />
                            )}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label>Notes</Label>
                        <Controller
                            control={control}
                            name='notes'
                            render={({field}) => (
                                <Textarea
                                    errorMessage={errors.notes?.message}
                                    {...field}
                                    className='max-h-32 min-h-20'
                                />
                            )}
                        />
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button variant='cancel' className='w-fit px-4' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='w-fit px-4'
                            disabled={isSubmitting || !isDirty}
                            isLoading={isSubmitting}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalCreateAppointment;
