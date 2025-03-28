import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {DataTable, Icon, Pagination} from '@/components/common';
import {
    Button,
    Input,
    Label,
    ScrollArea,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize, cn, formatDate, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {GENDER, ROLE} from '@/modules/auth/auth.enum';
import {IMedicalRecord, IPrescription} from '@/modules/medical-record/medical-record.interface';
import {useGetMedicalRecords} from '@/modules/medical-record/medical-record.swr';
import {IUpdatePatient} from '@/modules/patient/patient.interface';
import {PatientService} from '@/modules/patient/patient.service';
import {updatePatientResolver} from '@/modules/patient/patient.validate';
import {ENUM_ROUTES} from '@/routes/routes.enum';

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
        state: {user, isLoading},
        mutateUser,
    } = useAuthContext();
    const navigate = useNavigate();

    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 10,
    });

    useEffect(() => {
        if (user?.role !== ROLE.PATIENT && !isLoading) {
            navigate(ENUM_ROUTES.HOME, {replace: true});
        }
    }, [navigate, user, isLoading]);

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

    const {data} = useGetMedicalRecords(pagination, user?.role, !!user?.role);
    const records = data?.data || [];
    const paginationData = data?.pagination;

    const columns: ColumnDef<IMedicalRecord>[] = [
        {
            accessorKey: 'id',
            header: () => <div className='font-bold'>Date / ID</div>,
            cell: ({row}) => (
                <div>
                    <p className='text-sm font-medium'>{formatDate(new Date(row.original.recordDate)).day}</p>
                    <p className='text-5c5c5c text-xs'>{formatId(row.original.id)}</p>
                </div>
            ),
        },
        {
            accessorKey: 'diagnosis',
            header: () => <div className='font-bold'>Diagnosis</div>,
            cell: ({row}) => <div>{row.original.diagnosis}</div>,
        },
        {
            accessorKey: 'doctor.name',
            header: () => <div className='font-bold'>Doctor Name</div>,
            cell: ({row}) => <div>{row.original.doctor.name}</div>,
        },
        {
            accessorKey: 'doctor.phoneNumber',
            header: () => <div className='font-bold'>Phone Number</div>,
            cell: ({row}) => <div>{row.original.doctor.phoneNumber}</div>,
        },
        {
            id: 'icon',
            header: '',
            size: 28,
            cell: ({row}) => (
                <Icon
                    name='caret-down'
                    width={28}
                    height={28}
                    className={cn(
                        'text-primary-light transition-transform',
                        row.getIsExpanded() ? 'rotate-180' : 'rotate-0'
                    )}
                />
            ),
        },
    ];

    const childColumns: ColumnDef<IPrescription>[] = [
        {
            accessorKey: 'id',
            header: () => <div className='font-bold'>ID</div>,
            cell: ({row}) => <div>{formatId(row.original.id)}</div>,
        },
        {
            accessorKey: 'medication',
            header: () => <div className='font-bold'>Medication</div>,
            cell: ({row}) => <div>{row.original.medication}</div>,
        },
        {
            accessorKey: 'dosage',
            header: () => <div className='font-bold'>Dosage</div>,
            cell: ({row}) => <div>{row.original.dosage}</div>,
        },
    ];

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
            <h1>Your Medical Records</h1>
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', records.length <= 8 ? 'h-fit' : 'h-[30vh]')}>
                    <DataTable
                        data={records}
                        columns={columns}
                        childRow={(row) => (
                            <ScrollArea
                                className={cn(
                                    'bg-slate-100 px-1 py-2',
                                    row.prescriptions.length > 2 ? 'h-32' : 'h-fit'
                                )}
                            >
                                <h3 className='ml-2 text-xl underline'>Prescriptions</h3>
                                <DataTable
                                    data={row.prescriptions}
                                    columns={childColumns}
                                    className='hover:bg-slate-200'
                                />
                            </ScrollArea>
                        )}
                    />
                    <Separator className='bg-black' />
                    {records && paginationData && paginationData.totalItems > 0 && (
                        <Pagination
                            currentPage={pagination.page!}
                            perPage={pagination.perPage!}
                            totalItems={paginationData.totalItems}
                            onGoToPage={(page: number) => setPagination({...pagination, page})}
                            className='rounded-b-md px-4 pt-4 pb-2'
                        />
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}

export default ProfilePage;
