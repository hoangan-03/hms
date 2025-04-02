import {Calendar, MapPin, Phone, User, Users} from 'lucide-react';
import {useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
    Separator,
} from '@/components/ui';
import {capitalize} from '@/lib/utils';
import {GENDER} from '@/modules/auth/auth.enum';
import {IPatient, IUpdatePatient} from '@/modules/patient/patient.interface';
import {PatientService} from '@/modules/patient/patient.service';
import {updatePatientResolver} from '@/modules/patient/patient.validate';

interface Props {
    open: boolean;
    data?: IPatient;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

const genders = Object.values(GENDER);

type FormValues = {
    id: number;
    name: string | null;
    age: number | null;
    gender: GENDER | null;
    phoneNumber: string | null;
    address: string | null;
};

function ModalPatientDetails({open, data, onClose, onSubmitSuccess}: Props) {
    const {
        control,
        handleSubmit,
        formState: {errors, isDirty, isSubmitting},
        reset,
    } = useForm<FormValues>({
        resolver: updatePatientResolver,
        values: {
            id: data?.id || 0,
            name: data?.name || '',
            age: data?.age || 0,
            gender: data?.gender || null,
            phoneNumber: data?.phoneNumber || '',
            address: data?.address || '',
        },
    });

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (data.id === 0) {
                throw new Error('Invalid patient ID');
            }
            const payload: IUpdatePatient = {
                name: data.name!,
                age: data.age!,
                gender: data.gender !== GENDER.NULL ? data.gender! : undefined,
                phoneNumber: data.phoneNumber!,
                address: data.address!,
            };
            await PatientService.doctorUpdatePatient(data.id, payload);
            toast.success('Patient details updated successfully!');
            onSubmitSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update patient details');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-[750px] p-0'>
                <DialogHeader className='px-6 pt-4'>
                    <DialogTitle className='flex items-center text-2xl'>
                        <User className='text-primary mr-2 h-5 w-5' />
                        Patient Information
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='px-6 pb-6'>
                    <Card className='mb-2 gap-2'>
                        <CardHeader className=''>
                            <CardTitle className='text-md flex items-center'>
                                <Users className='mr-2 h-4 w-4 text-gray-500' />
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-5'>
                            <div className='flex flex-wrap items-start gap-4'>
                                <div className='min-w-[280px] flex-1 space-y-2'>
                                    <Label className='flex items-center text-gray-700'>
                                        <User className='mr-1 h-3.5 w-3.5 opacity-70' />
                                        Full Name
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='name'
                                        render={({field: {value, onChange, ref}}) => (
                                            <Input
                                                ref={ref}
                                                onChange={onChange}
                                                value={value || ''}
                                                className='py-2'
                                                placeholder='Enter patient name'
                                                errorMessage={errors.name?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div className='w-[100px] space-y-2'>
                                    <Label className='flex items-center text-gray-700'>
                                        <Calendar className='mr-1 h-3.5 w-3.5 opacity-70' />
                                        Age
                                    </Label>
                                    <Controller
                                        control={control}
                                        name='age'
                                        render={({field: {value, onChange, ref}}) => (
                                            <Input
                                                ref={ref}
                                                onChange={onChange}
                                                value={value || ''}
                                                className='py-2'
                                                type='number'
                                                errorMessage={errors.age?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div className='w-[180px] space-y-2'>
                                    <Label className='flex items-center text-gray-700'>Gender</Label>
                                    <Controller
                                        control={control}
                                        name='gender'
                                        render={({field: {onChange, value}}) => (
                                            <div>
                                                <Select onValueChange={onChange} value={value || GENDER.NULL}>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder={capitalize(value || GENDER.NULL)} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {genders.map((item, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={item}
                                                                    disabled={item === GENDER.NULL}
                                                                >
                                                                    {capitalize(item)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.gender?.message && (
                                                    <p className='mt-1 text-sm text-red-500'>{errors.gender.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='mb-2 gap-2'>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-md flex items-center'>
                                <MapPin className='mr-2 h-4 w-4 text-gray-500' />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-5'>
                            <div className='space-y-2'>
                                <Label className='flex items-center text-gray-700'>
                                    <Phone className='mr-1 h-3.5 w-3.5 opacity-70' />
                                    Phone Number
                                </Label>
                                <Controller
                                    control={control}
                                    name='phoneNumber'
                                    render={({field: {value, onChange, ref}}) => (
                                        <Input
                                            ref={ref}
                                            onChange={onChange}
                                            value={value || ''}
                                            className='py-2'
                                            placeholder='Enter phone number'
                                            errorMessage={errors.phoneNumber?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='flex items-center text-gray-700'>
                                    <MapPin className='mr-1 h-3.5 w-3.5 opacity-70' />
                                    Address
                                </Label>
                                <Controller
                                    control={control}
                                    name='address'
                                    render={({field: {value, onChange, ref}}) => (
                                        <Input
                                            ref={ref}
                                            onChange={onChange}
                                            value={value || ''}
                                            className='py-2'
                                            placeholder='Enter address'
                                            errorMessage={errors.address?.message}
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Separator className='my-6' />

                    <div className='flex justify-end gap-3'>
                        <Button variant='outline' onClick={onClose} type='button'>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={!isDirty || isSubmitting} isLoading={isSubmitting}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPatientDetails;
