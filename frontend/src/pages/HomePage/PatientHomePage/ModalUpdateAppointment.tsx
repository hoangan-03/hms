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
import {IAppointment, IUpdateAppointment} from '@/modules/appointment/appointment.interface';
import {AppointmentService} from '@/modules/appointment/appointment.service';
import {useGetAvailableDoctors} from '@/modules/appointment/appointment.swr';
import {updateAppointmentResolver} from '@/modules/appointment/appointment.validate';
import {IDoctor} from '@/modules/doctor/doctor.interface';

interface Props {
    open: boolean;
    autoFocus?: boolean;
    data?: IAppointment;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

const timeSlots = Object.values(APPOINTMENT_TIME_SLOT);

const today = new Date(new Intl.DateTimeFormat('en-US', timeZoneOptions).format(new Date()));

type FormValues = {
    id: number;
    date: Date;
    timeSlot: APPOINTMENT_TIME_SLOT;
    doctor: IDoctor;
    reason?: string | null;
    notes?: string | null;
};

function ModalUpdateAppointment({open, autoFocus, data, onClose, onSubmitSuccess}: Props) {
    const {
        control,
        handleSubmit,
        watch,
        formState: {errors, isDirty, isSubmitting},
        reset,
    } = useForm<FormValues>({
        resolver: updateAppointmentResolver,
        values: {
            id: data?.id || 0,
            date: data?.date ? new Date(data.date) : today,
            timeSlot: data?.timeSlot || APPOINTMENT_TIME_SLOT.A10_11,
            doctor: data?.doctor || ({} as IDoctor),
            reason: data?.reason || '',
            notes: data?.notes || '',
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
            if (!data?.id) throw new Error('Invalid appointment id');
            const payload: IUpdateAppointment = {
                date: formatDate(data.date, {dateKind: 'YYYY-MM-DD', dateDelimiter: '-'}).day,
                timeSlot: data.timeSlot,
                doctorId: data.doctor?.id || 0,
                ...(data.reason && {reason: data.reason}),
                ...(data.notes && {notes: data.notes}),
            };
            console.log(payload);
            // await AppointmentService.updateAppointment(data.id, payload);
            // toast.success('Appointment updated successfully');
            // onSubmitSuccess?.();
            // onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update appointment');
        }
    };

    const handleCancelStatus = async () => {
        try {
            if (!data?.id) throw new Error('Invalid appointment id');
            await AppointmentService.cancelAppointment(data.id);
            toast.success('Appointment cancelled successfully');
            onSubmitSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to cancel appointment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[600px]' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle>Update Appointment</DialogTitle>
                    <DialogDescription className='font-bold'>Update your appointment accordingly</DialogDescription>
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
                                            <SelectValue placeholder={formatAppointmentTime(value)} />
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
                                    className='max-h-32 min-h-20'
                                    {...field}
                                    value={field.value ?? ''}
                                    errorMessage={errors.reason?.message}
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
                                    className='max-h-32 min-h-20'
                                    {...field}
                                    value={field.value ?? ''}
                                    errorMessage={errors.notes?.message}
                                />
                            )}
                        />
                    </div>
                    <div className='flex items-center gap-4'>
                        <p>Cancel Appointment:</p>
                        <Button
                            variant='error'
                            className='w-fit py-1'
                            onClick={handleCancelStatus}
                            disabled={data?.status !== 'PENDING'}
                        >
                            Cancel
                        </Button>
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button variant='cancel' className='w-fit' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='w-fit'
                            disabled={!isDirty || isSubmitting}
                            isLoading={isSubmitting}
                        >
                            Update
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalUpdateAppointment;
