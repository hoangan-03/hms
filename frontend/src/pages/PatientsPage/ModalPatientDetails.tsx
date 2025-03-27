import {useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
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
import {updatePatientResolver} from '@/modules/patient/patient.validate';

interface Props {
    open: boolean;
    data?: IPatient;
    onClose: () => void;
}

const genders = Object.values(GENDER);

type FormValues = {
    name: string | null;
    age: number | null;
    gender: GENDER | null;
    phoneNumber: string | null;
    address: string | null;
};

function ModalPatientDetails({open, data, onClose}: Props) {
    const {
        control,
        handleSubmit,
        formState: {errors, isDirty, isSubmitting},
        reset,
    } = useForm<FormValues>({
        resolver: updatePatientResolver,
        values: {
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
            console.log(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update patient details');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='min-w-[720px]'>
                <DialogHeader>
                    <DialogTitle>Patient Details</DialogTitle>
                    <DialogDescription className='sr-only'>View details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='w-2/5 space-y-2'>
                            <Label>Name</Label>
                            <Controller
                                control={control}
                                name='name'
                                render={({field: {value, onChange, ref}}) => (
                                    <Input
                                        ref={ref}
                                        onChange={onChange}
                                        value={value || ''}
                                        className='py-2'
                                        errorMessage={errors.name?.message}
                                        errorClassName='truncate max-w-[200px]'
                                    />
                                )}
                            />
                        </div>
                        <div className='w-[30%] space-y-2'>
                            <Label>Age</Label>
                            <Controller
                                control={control}
                                name='age'
                                render={({field: {value, onChange, ref}}) => (
                                    <Input
                                        ref={ref}
                                        onChange={onChange}
                                        value={value || ''}
                                        className='py-2'
                                        errorMessage={errors.age?.message}
                                        errorClassName='truncate max-w-[200px]'
                                    />
                                )}
                            />
                        </div>
                        <div className='w-[30%] space-y-2'>
                            <Label>Gender</Label>
                            <Controller
                                control={control}
                                name='gender'
                                render={({field: {onChange, value}}) => (
                                    <>
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
                                        <p className='text-error mt-2'>{errors.gender?.message}</p>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label>Phone Number</Label>
                        <Controller
                            control={control}
                            name='phoneNumber'
                            render={({field: {value, onChange, ref}}) => (
                                <Input
                                    ref={ref}
                                    onChange={onChange}
                                    value={value || ''}
                                    className='py-2'
                                    errorMessage={errors.phoneNumber?.message}
                                />
                            )}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label>Address</Label>
                        <Controller
                            control={control}
                            name='address'
                            render={({field: {value, onChange, ref}}) => (
                                <Input
                                    ref={ref}
                                    onChange={onChange}
                                    value={value || ''}
                                    className='py-2'
                                    errorMessage={errors.address?.message}
                                />
                            )}
                        />
                    </div>
                    <div className='flex justify-center gap-16'>
                        <Button variant='cancel' className='w-20'>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='w-20'
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

export default ModalPatientDetails;
