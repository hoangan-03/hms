import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {DataTable, Icon, Pagination} from '@/components/common';
import {ScrollArea, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize, cn, formatDate, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {GENDER, ROLE} from '@/modules/auth/auth.enum';
import {IMedicalRecord, IPrescription} from '@/modules/medical-record/medical-record.interface';
import {useGetMedicalRecords} from '@/modules/medical-record/medical-record.swr';
import {ENUM_ROUTES} from '@/routes/routes.enum';

function MedicalRecordsPage() {
    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 10,
    });

    const {
        state: {user, isLoading},
    } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== ROLE.DOCTOR && !isLoading) {
            navigate(ENUM_ROUTES.HOME, {replace: true});
        }
    }, [navigate, user, isLoading]);

    const {data} = useGetMedicalRecords(pagination);
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
            accessorKey: 'patient.name',
            header: () => <div className='font-bold'>Patient Name</div>,
            cell: ({row}) => <div>{row.original.patient.name}</div>,
        },
        {
            accessorKey: 'patient.age',
            header: () => <div className='font-bold'>Age</div>,
            cell: ({row}) => <div>{row.original.patient.age}</div>,
        },
        {
            accessorKey: 'gender',
            header: () => <div className='font-bold'>Gender</div>,
            cell: ({row}) => (
                <div className='pl-4'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div
                                    className={cn(
                                        'size-4 rounded-full',
                                        row.original.patient.gender === 'MALE'
                                            ? 'bg-blue-400'
                                            : row.original.patient.gender === 'FEMALE'
                                              ? 'bg-pink-400'
                                              : 'bg-slate-300'
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{capitalize(row.original.patient.gender || GENDER.OTHER)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
        {
            accessorKey: 'diagnosis',
            header: () => <div className='font-bold'>Diagnosis</div>,
            cell: ({row}) => <div>{row.original.diagnosis}</div>,
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

    return (
        <div className='space-y-7 p-7'>
            <h1>Medical Records Management</h1>
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', records.length <= 8 ? 'h-fit' : 'h-[60vh]')}>
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

export default MedicalRecordsPage;
