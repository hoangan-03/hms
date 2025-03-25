import {ColumnDef} from '@tanstack/react-table';
import {useReducer} from 'react';

import {DataTable, Icon} from '@/components/common';
import {Badge, Button} from '@/components/ui';
import {formatAppointmentTime, formatDate, formatEnumString, formatId} from '@/lib/utils';
import {APPOINTMENT_STATUS, APPOINTMENT_TIME_SLOT} from '@/modules/appointment/appointment.enum';
import {IAppointment} from '@/modules/appointment/appointment.interface';

import ModalCreateAppointment from './ModalCreateAppointment';

const appointments: IAppointment[] = [
    {
        id: 1,
        date: '2025-04-15',
        timeSlot: APPOINTMENT_TIME_SLOT.A9_10,
        reason: 'Annual physical examination',
        notes: 'Need to fast for 12 hours before appointment',
        status: APPOINTMENT_STATUS.COMFIRMED,
        createdAt: '2025-03-20T09:15:00Z',
        updatedAt: '2025-03-21T14:30:00Z',
    },
    {
        id: 2,
        date: '2025-04-18',
        timeSlot: APPOINTMENT_TIME_SLOT.A14_15,
        reason: 'Persistent headache consultation',
        notes: 'Experiencing headaches for the past two weeks',
        status: APPOINTMENT_STATUS.PENDING,
        createdAt: '2025-03-22T11:20:00Z',
        updatedAt: '2025-03-22T11:20:00Z',
    },
    {
        id: 3,
        date: '2025-04-10',
        timeSlot: APPOINTMENT_TIME_SLOT.A16_17,
        reason: 'Follow-up after surgery',
        notes: 'Post-operative check for appendectomy performed on 2025-03-01',
        status: APPOINTMENT_STATUS.COMFIRMED,
        createdAt: '2025-03-15T16:45:00Z',
        updatedAt: '2025-03-16T10:00:00Z',
    },
    {
        id: 4,
        date: '2025-04-05',
        timeSlot: APPOINTMENT_TIME_SLOT.A11_12,
        reason: 'Vaccination',
        notes: 'COVID-19 booster shot',
        status: APPOINTMENT_STATUS.CANCELLED,
        createdAt: '2025-03-01T08:30:00Z',
        updatedAt: '2025-03-04T15:15:00Z',
    },
    {
        id: 5,
        date: '2025-04-22',
        timeSlot: APPOINTMENT_TIME_SLOT.A13_14,
        reason: 'Dermatology consultation',
        notes: 'Skin rash on arms and neck',
        status: APPOINTMENT_STATUS.PENDING,
        createdAt: '2025-03-23T13:10:00Z',
        updatedAt: '2025-03-23T13:10:00Z',
    },
];

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

function PatientPage() {
    const [state, dispatch] = useReducer(reducer, {type: ActionKind.NONE});

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
    ];

    return (
        <div className='space-y-7 p-7'>
            <div className='space-y-1'>
                <h1>Appointments Management</h1>
                <p>Welcome Moni Roy</p>
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
            <div className='bg-white'>
                <DataTable data={appointments} columns={columns} />
            </div>
            <ModalCreateAppointment
                open={state.type === ActionKind.MODAL_CREATE_APPOINTMENT_SHOW}
                onClose={() => dispatch({type: ActionKind.NONE})}
                autoFocus={false}
            />
        </div>
    );
}

export default PatientPage;
