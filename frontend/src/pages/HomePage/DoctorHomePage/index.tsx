import {ColumnDef} from '@tanstack/react-table';
import {useReducer, useState} from 'react';

import {DataTable, Icon, Pagination} from '@/components/common';
import {Badge, Button, ScrollArea, Separator} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {cn, formatAppointmentTime, formatDate, formatEnumString, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {IAppointment} from '@/modules/appointment/appointment.interface';
import {useGetAppointmentsDoctors} from '@/modules/appointment/appointment.swr';

// import {useGetAppointments} from '@/modules/appointment/appointment.swr';
import ModalUpdateAppointmentStatus from './ModalUpdateAppointmentStatus';

enum ActionKind {
    MODAL_UPDATE_APPOINTMENT_STATUS_SHOW = 'MODAL_UPDATE_APPOINTMENT_STATUS_SHOW',
    NONE = 'NONE',
}

interface Action<T = undefined> {
    type: ActionKind;
    payload?: T;
}

type ShowUpdateAppointmentStatusModalPayload = {
    appointment: IAppointment;
};

interface State {
    type: ActionKind;
    appointment?: IAppointment;
}

// Action creators
const actions = {
    showUpdateAppointmentStatusModal: (appointment: IAppointment): Action<ShowUpdateAppointmentStatusModalPayload> => ({
        type: ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW,
        payload: {appointment},
    }),
    closeModal: (): Action => ({
        type: ActionKind.NONE,
    }),
};

const reducer = (state: State, action: Action<unknown>): State => {
    switch (action.type) {
        case ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW,
                appointment: (action.payload as ShowUpdateAppointmentStatusModalPayload).appointment,
            };
        default:
            return {
                ...state,
                type: ActionKind.NONE,
            };
    }
};

function DoctorHomePage() {
    const [state, dispatch] = useReducer(reducer, {type: ActionKind.NONE});
    const {
        state: {user},
    } = useAuthContext();

    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 10,
    });

    const {data, mutate} = useGetAppointmentsDoctors(pagination);
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
            accessorKey: 'patient',
            header: () => <div className='font-bold'>Patient</div>,
            cell: ({row}) => <div>{row.original.patient.name}</div>,
        },
        {
            accessorKey: 'reason',
            header: () => <div className='font-bold'>Reason</div>,
            cell: ({row}) => <div className='max-w-40 truncate'>{row.original.reason}</div>,
        },
        {
            accessorKey: 'status',
            header: () => <div className='font-bold'>Status</div>,
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

    return (
        <div className='space-y-7 p-7'>
            <div className='space-y-1'>
                <h1>Appointments Management</h1>
            </div>
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', appointments.length <= 8 ? 'h-fit' : 'h-[70vh]')}>
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
            <ModalUpdateAppointmentStatus
                open={state.type === ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW}
                onClose={() => dispatch(actions.closeModal())}
                onSucessfulSubmit={() => mutate()}
                data={state.appointment}
            />
        </div>
    );
}

export default DoctorHomePage;
