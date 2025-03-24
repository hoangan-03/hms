import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label} from '@/components/ui';
import {IPatient} from '@/modules/patient/patient.interface';

interface Props {
    open: boolean;
    data?: IPatient;
    onClose: () => void;
}

function ModalPatientDetails({open, data, onClose}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[720px]'>
                <DialogHeader>
                    <DialogTitle>Patient Details</DialogTitle>
                    <DialogDescription className='sr-only'>View details</DialogDescription>
                </DialogHeader>
                <form className='space-y-4'>
                    <div className='space-y-2'>
                        <Label>Name</Label>
                        <Input disabled className='py-2' value={data?.name} />
                    </div>
                    <div className='space-y-2'>
                        <Label>Name</Label>
                        <Input className='py-2' />
                    </div>
                    <div className='space-y-2'>
                        <Label>Name</Label>
                        <Input className='py-2' />
                    </div>
                    <div className='space-y-2'>
                        <Label>Name</Label>
                        <Input className='py-2' />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPatientDetails;
