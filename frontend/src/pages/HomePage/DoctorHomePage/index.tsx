import {ColumnDef} from '@tanstack/react-table';
import {useReducer} from 'react';

import {DataTable, Icon} from '@/components/common';
import {Badge, Button} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {formatAppointmentTime, formatDate, formatEnumString, formatId} from '@/lib/utils';
import {IAppointment} from '@/modules/appointment/appointment.interface';
import {useGetAppointments} from '@/modules/appointment/appointment.swr';

import ModalUpdateAppointmentStatus from './ModalUpdateAppointmentStatus';

enum ActionKind {
    MODAL_UPDATE_APPOINTMENT_STATUS_SHOW = 'MODAL_UPDATE_APPOINTMENT_STATUS_SHOW',
    NONE = 'NONE',
}

interface Action {
    type: ActionKind;
    appointment?: IAppointment;
}

interface State {
    type: ActionKind;
    appointment?: IAppointment;
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW,
                appointment: action.appointment,
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

    const {data} = useGetAppointments();
    const appointments = data?.data || [];

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
        {
            id: 'actions',
            header: () => <div className='font-bold'>Actions</div>,
            cell: ({row}) => (
                <div className='flex gap-2'>
                    <Button
                        size='icon'
                        variant='none'
                        onClick={() =>
                            dispatch({type: ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW, appointment: row.original})
                        }
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
                <p>
                    It is nice to see you, <span className='font-bold'>{user?.name}</span>
                </p>
            </div>
            <div className='bg-white'>
                <DataTable data={appointments} columns={columns} />
            </div>
            <ModalUpdateAppointmentStatus
                open={state.type === ActionKind.MODAL_UPDATE_APPOINTMENT_STATUS_SHOW}
                onClose={() => dispatch({type: ActionKind.NONE})}
                data={state.appointment}
            />
        </div>
    );
}

export default DoctorHomePage;
