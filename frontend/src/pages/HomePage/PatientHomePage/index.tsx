import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {ArrowDown, ArrowUp, ArrowUpDown} from 'lucide-react';
import {useReducer, useState} from 'react';

import {Icon, Pagination} from '@/components/common';
import {Badge, Button, ScrollArea, Separator} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {cn, formatAppointmentTime, formatDate, formatEnumString, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {IAppointment} from '@/modules/appointment/appointment.interface';
import {useGetAppointments} from '@/modules/appointment/appointment.swr';

import ModalCreateAppointment from './ModalCreateAppointment';
import ModalUpdateAppointment from './ModalUpdateAppointment';

enum ActionKind {
    MODAL_CREATE_APPOINTMENT_SHOW = 'MODAL_CREATE_APPOINTMENT_SHOW',
    MODAL_UPDATE_APPOINTMENT_SHOW = 'MODAL_UPDATE_APPOINTMENT_SHOW',
    NONE = 'NONE',
}

interface Action<T = undefined> {
    type: ActionKind;
    payload?: T;
}

type ShowUpdateAppointmentModalPayload = {
    appointment: IAppointment;
};

const actions = {
    showCreateAppointmentModal: (): Action => ({
        type: ActionKind.MODAL_CREATE_APPOINTMENT_SHOW,
    }),
    showUpdateAppointmentStatusModal: (appointment: IAppointment): Action<ShowUpdateAppointmentModalPayload> => ({
        type: ActionKind.MODAL_UPDATE_APPOINTMENT_SHOW,
        payload: {appointment},
    }),
    closeModal: (): Action => ({
        type: ActionKind.NONE,
    }),
};

interface State {
    type: ActionKind;
    appointment?: IAppointment;
}

const reducer = (state: State, action: Action<unknown>): State => {
    switch (action.type) {
        case ActionKind.MODAL_CREATE_APPOINTMENT_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_CREATE_APPOINTMENT_SHOW,
            };
        case ActionKind.MODAL_UPDATE_APPOINTMENT_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_UPDATE_APPOINTMENT_SHOW,
                appointment: (action.payload as ShowUpdateAppointmentModalPayload).appointment,
            };
        default:
            return {
                ...state,
                type: ActionKind.NONE,
            };
    }
};

function PatientHomePage() {
    const [state, dispatch] = useReducer(reducer, {type: ActionKind.NONE});
    const {
        state: {user},
    } = useAuthContext();

    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 10,
    });

    // Add state for sorting
    const [sorting, setSorting] = useState<SortingState>([]);

    const {data, mutate} = useGetAppointments(pagination);
    const appointments = data?.data || [];
    const paginationData = data?.pagination;

    // Configure table with sorting functionality
    const table = useReactTable({
        data: appointments,
        columns: getColumns(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // Define columns with sorting support
    function getColumns(): ColumnDef<IAppointment>[] {
        return [
            {
                accessorKey: 'id',
                size: 80,
                header: ({column}) => (
                    <div className='flex cursor-pointer items-center font-bold' onClick={() => column.toggleSorting()}>
                        ID
                        <SortIcon column={column} />
                    </div>
                ),
                cell: ({row}) => <div>{formatId(row.original.id)}</div>,
            },
            {
                accessorKey: 'date',
                header: ({column}) => (
                    <div className='flex cursor-pointer items-center font-bold' onClick={() => column.toggleSorting()}>
                        Date
                        <SortIcon column={column} />
                    </div>
                ),
                cell: ({row}) => <div>{formatDate(new Date(row.original.date)).day}</div>,
            },
            {
                accessorKey: 'timeSlot',
                header: ({column}) => (
                    <div className='flex cursor-pointer items-center font-bold' onClick={() => column.toggleSorting()}>
                        Time
                        <SortIcon column={column} />
                    </div>
                ),
                cell: ({row}) => <div>{formatAppointmentTime(row.original.timeSlot)}</div>,
            },
            {
                accessorKey: 'doctor.name',
                header: ({column}) => (
                    <div className='flex cursor-pointer items-center font-bold' onClick={() => column.toggleSorting()}>
                        Doctor
                        <SortIcon column={column} />
                    </div>
                ),
                cell: ({row}) => <div>{row.original.doctor.name}</div>,
            },
            {
                accessorKey: 'reason',
                header: ({column}) => (
                    <div className='flex cursor-pointer items-center font-bold' onClick={() => column.toggleSorting()}>
                        Reason
                        <SortIcon column={column} />
                    </div>
                ),
                cell: ({row}) => (
                    <div className='max-w-40 truncate'>{row.original.reason ? row.original.reason : '<empty>'}</div>
                ),
            },
            {
                accessorKey: 'status',
                header: ({column}) => (
                    <div className='flex cursor-pointer items-center font-bold' onClick={() => column.toggleSorting()}>
                        Status
                        <SortIcon column={column} />
                    </div>
                ),
                cell: ({row}) => (
                    <div>
                        <Badge
                            variant={
                                row.original.status === 'PENDING'
                                    ? 'warning'
                                    : row.original.status === 'CANCELLED'
                                      ? 'error'
                                      : 'success'
                            }
                        >
                            {formatEnumString(row.original.status)}
                        </Badge>
                    </div>
                ),
            },
            {
                id: 'actions',
                header: () => <div className='font-bold'>Actions</div>,
                enableSorting: false,
                cell: ({row}) => (
                    <div className='flex gap-2'>
                        <Button
                            size='icon'
                            variant='none'
                            onClick={() => dispatch(actions.showUpdateAppointmentStatusModal(row.original))}
                        >
                            <Icon
                                name='pencil'
                                width={18}
                                height={18}
                                className='text-primary-light hover:brightness-110'
                            />
                        </Button>
                    </div>
                ),
            },
        ];
    }

    // Helper component for sort icons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function SortIcon({column}: {column: any}) {
        if (!column.getCanSort()) return null;

        if (column.getIsSorted() === 'asc') {
            return <ArrowUp className='ml-2 h-4 w-4' />;
        } else if (column.getIsSorted() === 'desc') {
            return <ArrowDown className='ml-2 h-4 w-4' />;
        }
        return <ArrowUpDown className='ml-2 h-4 w-4 opacity-50' />;
    }

    return (
        <div className='space-y-7 p-7'>
            <div className='space-y-1'>
                <h1>Appointments Management</h1>
                <p>
                    Welcome, <span className='font-bold'>{user?.name}</span>
                </p>
            </div>
            <div className='flex justify-center'>
                <Button
                    className='w-60 items-center'
                    suffixIcon={<Icon name='add-round-fill' className='text-primary-light' />}
                    onClick={() => dispatch(actions.showCreateAppointmentModal())}
                >
                    Schedule Appointment
                </Button>
            </div>
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', appointments.length <= 8 ? 'h-fit' : 'h-[60vh]')}>
                    {/* Replace DataTable with custom table implementation */}
                    <div className='w-full'>
                        <table className='w-full'>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className='border-b'>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className='px-4 py-3 text-left text-sm'>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className='border-b hover:bg-slate-50'>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className='px-4 py-3 text-sm'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Separator className='bg-black' />
                    {appointments && paginationData && paginationData.totalItems > 0 && (
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
            <ModalCreateAppointment
                open={state.type === ActionKind.MODAL_CREATE_APPOINTMENT_SHOW}
                onClose={() => dispatch(actions.closeModal())}
                autoFocus={false}
                onSuccessfulSubmit={() => mutate()}
            />
            <ModalUpdateAppointment
                open={state.type === ActionKind.MODAL_UPDATE_APPOINTMENT_SHOW}
                onClose={() => dispatch(actions.closeModal())}
                onSubmitSuccess={() => mutate()}
                autoFocus={false}
                data={state.appointment}
            />
        </div>
    );
}

export default PatientHomePage;
