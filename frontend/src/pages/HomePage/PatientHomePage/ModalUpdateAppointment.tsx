import {AlertCircle, CalendarIcon, Clock, FileText, NotepadText, User} from 'lucide-react';
import {useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {DatePicker} from '@/components/common';
import {
    Button,
    Card,
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
    const isEditable = data?.status === 'PENDING';
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
            if (!data?.id) throw new Error('Invalid appointment id');
            const payload: IUpdateAppointment = {
                date: formatDate(data.date, {dateKind: 'YYYY-MM-DD', dateDelimiter: '-'}).day,
                timeSlot: data.timeSlot,
                doctorId: data.doctor?.id || 0,
                ...(data.reason && {reason: data.reason}),
                ...(data.notes && {notes: data.notes}),
            };
            await AppointmentService.updateAppointment(data.id, payload);
            toast.success('Appointment updated successfully');
            onSubmitSuccess?.();
            onClose();
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
            <DialogContent className='max-w-[800px] min-w-[650px] rounded-xl p-6' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>
                        {isEditable ? 'Update Appointment' : 'View Appointment'}
                    </DialogTitle>
                    {!isEditable && (
                        <div className='mt-2 rounded-md border border-amber-200 bg-amber-50 p-3'>
                            <p className='flex items-center text-amber-800'>
                                <AlertCircle className='mr-2 h-5 w-5 text-amber-600' />
                                {data?.status === 'CANCELLED'
                                    ? 'This appointment has been cancelled and cannot be modified.'
                                    : 'This appointment has been confirmed and cannot be modified.'}
                            </p>
                        </div>
                    )}
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    {/* Scheduling Section */}
                    <div className='rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm'>
                        <h3 className='mb-3 flex items-center text-sm font-medium text-gray-500 uppercase'>
                            <CalendarIcon className='mr-1 h-4 w-4' />
                            Scheduling
                        </h3>

                        <div className='grid grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <Label className='text-gray-700'>Date</Label>
                                <Controller
                                    control={control}
                                    name='date'
                                    render={({field: {onChange, value}}) => (
                                        <DatePicker currentDate={value} setCurrentDate={onChange} minDate={today} />
                                    )}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='flex items-center text-gray-700'>
                                    <Clock className='h-4 w-4 opacity-70' /> Time Slot
                                </Label>
                                <Controller
                                    control={control}
                                    name='timeSlot'
                                    render={({field: {onChange, value}}) => (
                                        <Select onValueChange={onChange} value={value}>
                                            <SelectTrigger className='w-full'>
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
                    </div>

                    {/* Doctor Selection */}
                    <div className='space-y-2'>
                        <Label className='flex items-center text-gray-700'>
                            <User className='h-4 w-4 opacity-70' /> Doctor
                        </Label>
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
                            )}
                        />
                        {!isLoading && doctors.length <= 0 && (
                            <p className='mt-1 flex items-center text-sm text-amber-600'>
                                <AlertCircle className='mr-1 h-3 w-3' />
                                No doctors are available for this time slot. Try another date or time.
                            </p>
                        )}
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
                                            value={field.value ?? ''}
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
                                            value={field.value ?? ''}
                                            placeholder='Any additional information for the doctor...'
                                            errorMessage={errors.notes?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cancel Appointment Section */}
                    {data?.status === 'PENDING' && (
                        <Card className='border-amber-100 bg-amber-50 p-4'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h4 className='flex items-center font-medium text-amber-900'>
                                        <AlertCircle className='mr-1 h-4 w-4' />
                                        Cancel Appointment
                                    </h4>
                                    <p className='mt-1 text-sm text-amber-700'>This action cannot be undone.</p>
                                </div>
                                <Button variant='error' size='sm' onClick={handleCancelStatus} className='px-4'>
                                    Cancel Appointment
                                </Button>
                            </div>
                        </Card>
                    )}

                    <div className='flex justify-end gap-3'>
                        <Button variant='cancel' onClick={onClose} className='px-6'>
                            {isEditable ? 'Cancel' : 'Close'}
                        </Button>

                        {/* Only show Save button if appointment is editable */}
                        {isEditable && (
                            <Button
                                type='submit'
                                className='px-8'
                                disabled={!isDirty || isSubmitting || !watch('doctor')?.id}
                                isLoading={isSubmitting}
                            >
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalUpdateAppointment;
