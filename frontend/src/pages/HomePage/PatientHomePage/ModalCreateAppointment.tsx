import {AlertCircle, CalendarIcon, Clock, FileText, NotepadText, Plus, User} from 'lucide-react';
import {useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {DatePicker} from '@/components/common';
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
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

    const {data: doctors = [], isLoading} = useGetAvailableDoctors({
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
            await AppointmentService.createAppointment(payload);
            toast.success('Appointment created successfully');
            onSuccessfulSubmit();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create appointment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-[800px] min-w-[650px] rounded-xl p-6' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2 text-2xl'>
                        <Plus size={20} className='text-primary' />
                        Schedule your appointment
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Scheduling Section */}
                    <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm'>
                        <h3 className='mb-3 flex items-center text-sm font-medium text-gray-500 uppercase'>
                            <CalendarIcon className='mr-1 h-4 w-4' />
                            Scheduling
                        </h3>

                        <div className='grid grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <Label className='flex items-center text-gray-700'>
                                    <CalendarIcon className='mr-1 h-4 w-4 opacity-70' /> Date
                                </Label>
                                <Controller
                                    control={control}
                                    name='date'
                                    render={({field: {onChange, value}}) => (
                                        <DatePicker
                                            currentDate={value}
                                            setCurrentDate={onChange}
                                            minDate={today}
                                            className='w-full'
                                        />
                                    )}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='flex items-center text-gray-700'>
                                    <Clock className='mr-1 h-4 w-4 opacity-70' /> Time Slot
                                </Label>
                                <Controller
                                    control={control}
                                    name='timeSlot'
                                    render={({field: {onChange, value}}) => (
                                        <Select onValueChange={onChange} value={value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue
                                                    placeholder={formatAppointmentTime(value || timeSlots[0])}
                                                />
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
                    </div>

                    {/* Doctor Selection */}
                    <div className='space-y-2'>
                        <Label className='flex items-center text-gray-700'>
                            <User className='mr-1 h-4 w-4 opacity-70' /> Doctor
                        </Label>
                        <Controller
                            control={control}
                            name='doctor'
                            render={({field: {onChange, value}}) => (
                                <div className='space-y-1'>
                                    <Select
                                        onValueChange={(doctorId) => {
                                            const selectedDoctor = doctors.find((doc) => doc.id === parseInt(doctorId));
                                            onChange(selectedDoctor);
                                        }}
                                        value={value?.id?.toString()}
                                        disabled={doctors.length <= 0}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue
                                                placeholder={
                                                    doctors.length > 0
                                                        ? 'Select a doctor'
                                                        : 'No doctors available for this time'
                                                }
                                            />
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
                                    {errors.doctor && (
                                        <p className='flex items-center text-sm text-red-500'>
                                            <AlertCircle className='mr-1 h-3 w-3' />
                                            {errors.doctor.message}
                                        </p>
                                    )}
                                    {!isLoading && doctors.length <= 0 && (
                                        <p className='mt-1 flex items-center text-sm text-amber-600'>
                                            <AlertCircle className='mr-1 h-3 w-3' />
                                            No doctors are available for this time slot. Try another date or time.
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* Additional Information */}
                    <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm'>
                        <h3 className='mb-3 flex items-center text-sm font-medium text-gray-500 uppercase'>
                            <FileText className='mr-1 h-4 w-4' />
                            Additional Information
                        </h3>

                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label className='text-gray-700'>Reason for Visit</Label>
                                <Controller
                                    control={control}
                                    name='reason'
                                    render={({field}) => (
                                        <Textarea
                                            className='min-h-24 resize-none'
                                            {...field}
                                            placeholder='Briefly describe the reason for your appointment...'
                                            errorMessage={errors.reason?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='flex items-center text-gray-700'>
                                    <NotepadText className='mr-1 h-4 w-4 opacity-70' /> Additional Notes
                                </Label>
                                <Controller
                                    control={control}
                                    name='notes'
                                    render={({field}) => (
                                        <Textarea
                                            className='min-h-24 resize-none'
                                            {...field}
                                            placeholder='Any additional information or medical history the doctor should know...'
                                            errorMessage={errors.notes?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <Separator className='my-6' />
                    <div className='flex justify-end gap-3'>
                        <Button variant='outline' onClick={onClose} className='px-6'>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='px-8'
                            disabled={isSubmitting || !isDirty}
                            isLoading={isSubmitting}
                        >
                            Schdule Appointment
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalCreateAppointment;
