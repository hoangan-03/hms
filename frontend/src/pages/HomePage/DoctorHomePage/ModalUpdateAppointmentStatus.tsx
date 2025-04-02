import {AlertCircle, CalendarIcon, Check, Clock, FileText, User, X} from 'lucide-react';
import {toast} from 'react-toastify';

import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Label,
} from '@/components/ui';
import {timeZoneOptions} from '@/constants/dateTime';
import {formatAppointmentTime, formatDate} from '@/lib/utils';
import {IAppointment} from '@/modules/appointment/appointment.interface';
import {AppointmentService} from '@/modules/appointment/appointment.service';

interface Props {
    open: boolean;
    autoFocus?: boolean;
    data?: IAppointment;
    onClose: () => void;
    onSucessfulSubmit?: () => void;
}

const today = new Date(new Intl.DateTimeFormat('en-US', timeZoneOptions).format(new Date()));

function ModalUpdateAppointmentStatus({open, autoFocus, data, onClose, onSucessfulSubmit}: Props) {
    const handleCancelStatus = async () => {
        try {
            if (!data?.id) throw new Error('Invalid appointment id');
            await AppointmentService.cancelAppointment(data.id);
            toast.success('Appointment cancelled successfully');
            onSucessfulSubmit?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to cancel appointment');
        }
    };

    const handleConfirmStatus = async () => {
        try {
            if (!data?.id) throw new Error('Invalid appointment id');
            await AppointmentService.confirmAppointment(data.id);
            toast.success('Appointment confirmed successfully');
            onSucessfulSubmit?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to confirm appointment');
        }
    };

    // Function to get status badge with appropriate color
    const getStatusBadge = () => {
        switch (data?.status) {
            case 'PENDING':
                return (
                    <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700'>
                        Pending
                    </Badge>
                );
            case 'CONFIRMED':
                return (
                    <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700'>
                        Confirmed
                    </Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700'>
                        Cancelled
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[600px] p-0' autoFocus={autoFocus}>
                <DialogHeader className='px-6 pt-10'>
                    <div className='flex items-center justify-between'>
                        <DialogTitle className='text-2xl'>Appointment Details</DialogTitle>
                        {getStatusBadge()}
                    </div>
                </DialogHeader>

                <div className='px-6 pb-6'>
                    {/* Patient Info */}
                    <Card className='mb-2 gap-0 py-3'>
                        <CardHeader className='mb-0'>
                            <CardTitle className='text-md flex items-center'>
                                <User className='mr-2 h-4 w-4' />
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <Label className='text-sm text-gray-500'>Name</Label>
                                    <p className='font-medium'>{data?.patient?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className='text-sm text-gray-500'>Phone</Label>
                                    <p className='font-medium'>{data?.patient?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointment Details */}
                    <Card className='mb-2 gap-0 py-3'>
                        <CardHeader>
                            <CardTitle className='text-md flex items-center'>
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                Appointment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <Label className='flex items-center text-sm text-gray-500'>
                                        <CalendarIcon className='mr-1 h-3 w-3' /> Date
                                    </Label>
                                    <p className='font-medium'>{formatDate(new Date(data?.date || today)).day}</p>
                                </div>
                                <div>
                                    <Label className='flex items-center text-sm text-gray-500'>
                                        <Clock className='mr-1 h-3 w-3' /> Time
                                    </Label>
                                    <p className='font-medium'>{formatAppointmentTime(data?.timeSlot || 'a10_11')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medical Details */}
                    <Card className='gap-0 py-3'>
                        <CardHeader>
                            <CardTitle className='text-md flex items-center'>
                                <FileText className='mr-2 h-4 w-4' />
                                Medical Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <Label className='text-sm text-gray-500'>Reason for Visit</Label>
                                <p className='min-h-[60px] rounded-md border border-gray-100 bg-gray-50 p-2 font-medium whitespace-pre-wrap'>
                                    {data?.reason || 'No reason provided'}
                                </p>
                            </div>
                            <div>
                                <Label className='text-sm text-gray-500'>Additional Notes</Label>
                                <p className='min-h-[60px] rounded-md border border-gray-100 bg-gray-50 p-2 font-medium whitespace-pre-wrap'>
                                    {data?.notes || 'No notes provided'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Messages */}
                    {data?.status === 'CANCELLED' && (
                        <div className='mt-4 rounded-md border border-red-200 bg-red-50 p-3'>
                            <p className='flex items-center text-red-700'>
                                <AlertCircle className='mr-2 h-4 w-4' />
                                This appointment has been cancelled and cannot be updated further.
                            </p>
                        </div>
                    )}

                    {data?.status === 'CONFIRMED' && (
                        <div className='mt-4 rounded-md border border-green-200 bg-green-50 p-3'>
                            <p className='flex items-center text-green-700'>
                                <Check className='mr-2 h-4 w-4' />
                                This appointment is confirmed. You can still cancel it if needed.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='mt-6 flex justify-end gap-3'>
                        <Button variant='cancel' onClick={onClose}>
                            Close
                        </Button>

                        {/* Show Cancel button for both PENDING and CONFIRMED status */}
                        {(data?.status === 'PENDING' || data?.status === 'CONFIRMED') && (
                            <Button variant='error' onClick={handleCancelStatus}>
                                <X className='mr-1 h-4 w-4' />
                                Cancel Appointment
                            </Button>
                        )}

                        {/* Show Confirm button only for PENDING status */}
                        {data?.status === 'PENDING' && (
                            <Button variant='success' onClick={handleConfirmStatus}>
                                <Check className='mr-1 h-4 w-4' />
                                Confirm Appointment
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ModalUpdateAppointmentStatus;
