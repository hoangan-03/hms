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
import {IAppointment} from '@/modules/appointment/appointment.interface';

interface Props {
    open: boolean;
    autoFocus?: boolean;
    data?: IAppointment;
    onClose: () => void;
}

function ModalUpdateAppointmentStatus({open, autoFocus, onClose}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[600px]' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle>Update Appointment Status</DialogTitle>
                    <DialogDescription>Choose 'Cancel' or 'Confirm' to update status</DialogDescription>
                </DialogHeader>
                <form className='space-y-4'>
                    <div className='flex items-center justify-between gap-8'>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Date</Label>
                            <Input value='some date' disabled />
                        </div>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Time</Label>
                            <Input value='some time' disabled />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label>Reason</Label>
                        <Textarea className='max-h-32 min-h-20' value={'some reason'} disabled />
                    </div>
                    <div className='space-y-2'>
                        <Label>Notes</Label>
                        <Textarea className='max-h-32 min-h-20' value={'some notes'} disabled />
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button variant='cancel' className='w-20' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className='w-20'>Confirm</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalUpdateAppointmentStatus;
