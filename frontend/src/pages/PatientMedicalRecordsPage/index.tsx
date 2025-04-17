import {ColumnDef} from '@tanstack/react-table';
import {useState} from 'react';

import {DataTable, Pagination} from '@/components/common';
import {ScrollArea, Separator} from '@/components/ui';
import {cn, formatDate, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {ROLE} from '@/modules/auth/auth.enum';
import {IMedicalRecord, IPrescription} from '@/modules/medical-record/medical-record.interface';
import {useGetMedicalRecords} from '@/modules/medical-record/medical-record.swr';

function PatientMedicalRecordsPage() {
    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 8,
    });

    const {data} = useGetMedicalRecords(pagination, ROLE.PATIENT);
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
            header: () => <div className='font-bold'>Doctor</div>,
            cell: ({row}) => <div>{row.original.doctor.name}</div>,
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
            <h1>My Medical Records</h1>
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', records.length <= 8 ? 'h-fit' : 'h-[70vh]')}>
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

export default PatientMedicalRecordsPage;
