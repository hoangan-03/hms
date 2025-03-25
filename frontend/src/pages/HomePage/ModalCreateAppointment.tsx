import {useState} from 'react';

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
import {formatAppointmentTime} from '@/lib/utils';
import {APPOINTMENT_TIME_SLOT} from '@/modules/appointment/appointment.enum';
import {ROLE} from '@/modules/auth/auth.enum';
import {IDoctor} from '@/modules/doctor/doctor.interface';

interface Props {
    open: boolean;
    autoFocus?: boolean;
    onClose: () => void;
}

const timeSlots = Object.values(APPOINTMENT_TIME_SLOT);

const doctors: IDoctor[] = [
    {
        id: 1,
        name: 'Dr. Maria Chen',
        username: 'mchen_cardio',
        phoneNumber: '555-123-4567',
        role: ROLE.DOCTOR,
        createdAt: '2024-09-15T08:30:00Z',
        updatedAt: '2025-01-10T14:45:00Z',
    },
    {
        id: 2,
        name: 'Dr. James Wilson',
        username: 'jwilson_neuro',
        phoneNumber: '555-234-5678',
        role: ROLE.DOCTOR,
        createdAt: '2024-07-20T10:15:00Z',
        updatedAt: '2025-02-05T09:20:00Z',
    },
    {
        id: 3,
        name: 'Dr. Sarah Johnson',
        username: 'sjohnson_pedia',
        phoneNumber: '555-345-6789',
        role: ROLE.DOCTOR,
        createdAt: '2024-10-05T09:45:00Z',
        updatedAt: '2025-01-25T11:30:00Z',
    },
    {
        id: 4,
        name: 'Dr. Robert Garcia',
        username: 'rgarcia_ortho',
        phoneNumber: '555-456-7890',
        role: ROLE.DOCTOR,
        createdAt: '2024-08-12T14:20:00Z',
        updatedAt: '2025-02-18T16:10:00Z',
    },
    {
        id: 5,
        name: 'Dr. Emily Patel',
        username: 'epatel_derm',
        phoneNumber: '555-567-8901',
        role: ROLE.DOCTOR,
        createdAt: '2024-11-30T11:00:00Z',
        updatedAt: '2025-03-01T13:45:00Z',
    },
];

const today = new Date(new Intl.DateTimeFormat('en-US', timeZoneOptions).format(new Date()));

function ModalCreateAppointment({open, onClose, autoFocus}: Props) {
    const [currentDate, setCurrentDate] = useState<Date | null>(today);
    // <Controller
    //     control={control}
    //     name='date'
    //     render={({field: {onChange, value}}) => (
    //         <DatePicker
    //             currentDate={value}
    //             setCurrentDate={onChange}
    //             minDate={today}
    //             excludeDates={excludeDates}
    //             inline={true}
    //         />
    //     )}
    // />;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[600px]' autoFocus={autoFocus}>
                <DialogHeader>
                    <DialogTitle>Create Appointment</DialogTitle>
                    <DialogDescription>Please choose the appropriate time and doctor</DialogDescription>
                </DialogHeader>
                <form className='space-y-4'>
                    <div className='flex items-center justify-between gap-8'>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Date</Label>
                            <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} />
                        </div>
                        <div className='flex w-1/2 items-center gap-4 space-y-2'>
                            <Label>Time</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder={formatAppointmentTime(timeSlots[0])} />
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
                        </div>
                    </div>
                    <div className='flex gap-4 space-y-2'>
                        <Label>Doctor</Label>
                        {/* <Input className='py-2' /> */}
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder={doctors[0].name} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {doctors.map((item, index) => (
                                        <SelectItem key={index} value={item.name}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <Label>Reason</Label>
                        <Textarea className='max-h-32 min-h-20' />
                    </div>
                    <div className='space-y-2'>
                        <Label>Notes</Label>
                        <Textarea className='max-h-32 min-h-20' />
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button variant='cancel' className='w-20' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className='w-20'>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalCreateAppointment;
