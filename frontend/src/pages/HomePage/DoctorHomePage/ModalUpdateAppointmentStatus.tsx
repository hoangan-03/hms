import {toast} from 'react-toastify';

import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Textarea,
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[600px]' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle>Update Appointment Status</DialogTitle>
                    <DialogDescription className='font-bold'>
                        Choose 'Cancel' or 'Confirm' to update status
                    </DialogDescription>
                </DialogHeader>
                <form className='space-y-4'>
                    <div className='flex items-center justify-between gap-8'>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Date</Label>
                            <Input value={formatDate(new Date(data?.date || today)).day} disabled />
                        </div>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Time</Label>
                            <Input value={formatAppointmentTime(data?.timeSlot || 'a10_11')} disabled />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label>Reason</Label>
                        <Textarea className='max-h-32 min-h-20' value={data?.reason || ''} disabled />
                    </div>
                    <div className='space-y-2'>
                        <Label>Notes</Label>
                        <Textarea className='max-h-32 min-h-20' value={data?.notes || ''} disabled />
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button
                            variant='error'
                            className='w-fit'
                            onClick={handleCancelStatus}
                            disabled={data?.status !== 'PENDING'}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            className='w-fit'
                            onClick={handleConfirmStatus}
                            disabled={data?.status !== 'PENDING'}
                        >
                            Confirm
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalUpdateAppointmentStatus;
