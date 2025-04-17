import {useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {GENDER, ROLE} from '@/modules/auth/auth.enum';
import {IUpdatePatient} from '@/modules/patient/patient.interface';
import {PatientService} from '@/modules/patient/patient.service';
import {updatePatientResolver} from '@/modules/patient/patient.validate';

type FormValues = {
    id: number;
    name: string | null;
    age: number | null;
    gender: GENDER | null;
    phoneNumber: string | null;
    address: string | null;
};

const genders = Object.values(GENDER);

function ProfilePage() {
    const {
        state: {user},
        mutateUser,
    } = useAuthContext();

    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 10,
    });

    const {
        control,
        handleSubmit,
        formState: {errors, isDirty, isSubmitting},
    } = useForm<FormValues>({
        resolver: updatePatientResolver,
        values: {
            id: user?.id || 0,
            name: user?.name || '',
            age: user?.age || 0,
            gender: user?.gender || null,
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || '',
        },
    });
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (data.id <= 0) {
                throw new Error('Invalid patient ID');
            }
            const payload: IUpdatePatient = {
                name: data.name!,
                age: data.age!,
                gender: data.gender !== GENDER.NULL ? data.gender! : undefined,
                phoneNumber: data.phoneNumber!,
                address: data.address!,
            };
            await PatientService.updatePatient(payload);
            toast.success('Patient details updated successfully!');
            mutateUser();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className='space-y-4 p-7'>
            <h1>Your Profile</h1>
            {user?.role === ROLE.PATIENT ? (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
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
                    <div className='mt-4 flex justify-center gap-16'>
                        <Button
                            type='submit'
                            className='w-fit px-4'
                            disabled={!isDirty || isSubmitting}
                            isLoading={isSubmitting}
                            spinnerVariant='secondary'
                        >
                            Update
                        </Button>
                    </div>
                </form>
            ) : (
                <div className='space-y-4'>
                    <div className='rounded-md border p-6 shadow-sm'>
                        <h2 className='mb-4 text-xl font-medium'>Doctor Information</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm text-gray-500'>Name</p>
                                <p className='font-medium'>{user?.name}</p>
                            </div>
                            {/* <div>
                                <p className='text-sm text-gray-500'>Email</p>
                                <p className='font-medium'>{user?.email || 'Not provided'}</p>
                            </div> */}
                            <div>
                                <p className='text-sm text-gray-500'>Phone Number</p>
                                <p className='font-medium'>{user?.phoneNumber || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500'>Role</p>
                                <p className='font-medium capitalize'>{user?.role}</p>
                            </div>
                        </div>
                    </div>
                    <div className='text-sm text-gray-500'>
                        Please contact the administrator to update your profile information.
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
