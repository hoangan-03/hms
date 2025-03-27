import {ColumnDef} from '@tanstack/react-table';
import {useReducer, useState} from 'react';

import {DataTable, Icon, Pagination} from '@/components/common';
import {Badge, Button, ScrollArea, Separator} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {cn, formatAppointmentTime, formatDate, formatEnumString, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {IAppointment} from '@/modules/appointment/appointment.interface';
import {useGetAppointments} from '@/modules/appointment/appointment.swr';

import ModalCreateAppointment from './ModalCreateAppointment';

enum ActionKind {
    MODAL_CREATE_APPOINTMENT_SHOW = 'MODAL_CREATE_APPOINTMENT_SHOW',
    NONE = 'NONE',
}

interface Action {
    type: ActionKind;
}

interface State {
    type: ActionKind;
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionKind.MODAL_CREATE_APPOINTMENT_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_CREATE_APPOINTMENT_SHOW,
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

    const {data, mutate} = useGetAppointments(pagination);
    const appointments = data?.data || [];
    const paginationData = data?.pagination;

    const columns: ColumnDef<IAppointment>[] = [
        {
            accessorKey: 'id',
            size: 80,
            header: () => <div className='font-bold'>ID</div>,
            cell: ({row}) => <div>{formatId(row.original.id)}</div>,
        },
        {
            accessorKey: 'date',
            header: () => <div className='font-bold'>Date</div>,
            cell: ({row}) => <div>{formatDate(new Date(row.original.date)).day}</div>,
        },
        {
            accessorKey: 'timeSlot',
            header: () => <div className='font-bold'>Time</div>,
            cell: ({row}) => <div>{formatAppointmentTime(row.original.timeSlot)}</div>,
        },
        {
            accessorKey: 'doctor',
            header: () => <div className='font-bold'>Doctor</div>,
            cell: ({row}) => <div>{row.original.doctor.name}</div>,
        },
        {
            accessorKey: 'reason',
            header: () => <div className='font-bold'>Reason</div>,
            cell: ({row}) => (
                <div className='max-w-40 truncate'>{row.original.reason ? row.original.reason : '<empty>'}</div>
            ),
        },
        {
            accessorKey: 'status',
            header: () => <div className='font-bold'>Status</div>,
            cell: ({row}) => (
                <div>
                    <Badge
                        variant={
                            row.original.status === 'PENDING'
                                ? 'info'
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
    ];

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
                    onClick={() => dispatch({type: ActionKind.MODAL_CREATE_APPOINTMENT_SHOW})}
                >
                    Create Appointment
                </Button>
            </div>
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', appointments.length <= 8 ? 'h-fit' : 'h-[60vh]')}>
                    <DataTable data={appointments} columns={columns} />
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
                onClose={() => dispatch({type: ActionKind.NONE})}
                autoFocus={false}
                onSuccessfulSubmit={() => mutate()}
            />
        </div>
    );
}

export default PatientHomePage;
