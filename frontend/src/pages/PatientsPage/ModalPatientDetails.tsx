import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui';
import {capitalize} from '@/lib/utils';
import {GENDER} from '@/modules/auth/auth.enum';
import {IPatient} from '@/modules/patient/patient.interface';

interface Props {
    open: boolean;
    data?: IPatient;
    onClose: () => void;
}

const genders = Object.values(GENDER);

function ModalPatientDetails({open, data, onClose}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[720px]'>
                <DialogHeader>
                    <DialogTitle>Patient Details</DialogTitle>
                    <DialogDescription className='sr-only'>View details</DialogDescription>
                </DialogHeader>
                <form className='space-y-4'>
                    <div className='flex justify-between gap-4'>
                        <div className='w-4/5 space-y-2'>
                            <Label>Name</Label>
                            <Input disabled className='py-2' value={data?.name} />
                        </div>
                        <div className='w-1/5 space-y-2'>
                            <Label>Age</Label>
                            <Input className='py-2' />
                        </div>
                        <div className='w-fit space-y-2'>
                            <Label>Gender</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder={capitalize(genders[0])} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {genders.map((item, index) => (
                                            <SelectItem key={index} value={item}>
                                                {capitalize(item)}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label>Phone Number</Label>
                        <Input className='py-2' />
                    </div>
                    <div className='space-y-2'>
                        <Label>Address</Label>
                        <Input className='py-2' />
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button variant='cancel' className='w-20'>
                            Cancel
                        </Button>
                        <Button className='w-20'>Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPatientDetails;
