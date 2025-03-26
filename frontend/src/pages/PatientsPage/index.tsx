import {ColumnDef} from '@tanstack/react-table';
import {useReducer} from 'react';

import {DataTable, Icon} from '@/components/common';
import {Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize, cn, formatId} from '@/lib/utils';
import {GENDER, ROLE} from '@/modules/auth/auth.enum';
import {IPatient} from '@/modules/patient/patient.interface';

import ModalPatientDetails from './ModalPatientDetails';

enum ActionKind {
    MODAL_PATIENT_DETAILS_SHOW = 'MODAL_PATIENT_DETAILS_SHOW',
    NONE = 'NONE',
}

interface Action {
    type: ActionKind;
    patient?: IPatient;
}

interface State {
    type: ActionKind;
    patient?: IPatient;
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionKind.MODAL_PATIENT_DETAILS_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_PATIENT_DETAILS_SHOW,
                patient: action.patient,
            };
        default:
            return {
                ...state,
                type: ActionKind.NONE,
            };
    }
};

const patients: IPatient[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        username: 'sjohnson',
        age: 35,
        gender: GENDER.FEMALE,
        phoneNumber: '555-123-4567',
        address: '123 Oak Street, Springfield',
        role: ROLE.PATIENT,
        createdAt: '2024-12-10T09:30:00Z',
        updatedAt: '2025-02-15T14:22:00Z',
    },
    {
        id: 2,
        name: 'Michael Chen',
        username: 'mchen',
        age: 42,
        gender: GENDER.OTHER,
        phoneNumber: '555-987-6543',
        address: '456 Maple Avenue, Riverdale',
        role: ROLE.PATIENT,
        createdAt: '2024-11-05T11:15:00Z',
        updatedAt: '2025-01-20T16:45:00Z',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        username: 'erodriguez',
        age: 28,
        gender: GENDER.FEMALE,
        phoneNumber: '555-456-7890',
        address: '789 Pine Road, Lakeside',
        role: ROLE.PATIENT,
        createdAt: '2025-01-17T10:00:00Z',
        updatedAt: '2025-02-28T09:10:00Z',
    },
    {
        id: 4,
        name: 'James Wilson',
        username: 'jwilson',
        age: 56,
        gender: GENDER.MALE,
        phoneNumber: '555-222-3333',
        address: '101 Cedar Lane, Mountainview',
        role: ROLE.PATIENT,
        createdAt: '2024-09-30T08:20:00Z',
        updatedAt: '2025-03-05T13:30:00Z',
    },
    {
        id: 5,
        name: 'Aisha Patel',
        username: 'apatel',
        age: 31,
        gender: GENDER.FEMALE,
        phoneNumber: '555-789-0123',
        address: '234 Birch Boulevard, Westside',
        role: ROLE.PATIENT,
        createdAt: '2025-02-01T15:45:00Z',
        updatedAt: '2025-03-10T11:05:00Z',
    },
];

function PatientsPage() {
    const [state, dispatch] = useReducer(reducer, {type: ActionKind.NONE});
    const {onLogout} = useAuthContext();

    const columns: ColumnDef<IPatient>[] = [
        {
            accessorKey: 'id',
            header: () => <div className='font-bold'>ID</div>,
            cell: ({row}) => <div>{formatId(row.original.id)}</div>,
        },
        {
            accessorKey: 'name',
            header: () => <div className='font-bold'>Name</div>,
            cell: ({row}) => <div>{row.original.name}</div>,
        },
        {
            accessorKey: 'age',
            header: () => <div className='font-bold'>Age</div>,
            cell: ({row}) => <div>{row.original.age}</div>,
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
                                        row.original.gender === 'MALE'
                                            ? 'bg-blue-400'
                                            : row.original.gender === 'FEMALE'
                                              ? 'bg-pink-400'
                                              : 'bg-slate-300'
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{capitalize(row.original.gender)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
        {
            accessorKey: 'phoneNumber',
            header: () => <div className='font-bold'>Phone Number</div>,
            cell: ({row}) => <div>{row.original.phoneNumber}</div>,
        },
        {
            accessorKey: 'address',
            size: 200,
            header: () => <div className='font-bold'>Address</div>,
            cell: ({row}) => <div>{row.original.address}</div>,
        },
        {
            id: 'actions',
            header: () => <div className='font-bold'>Actions</div>,
            cell: ({row}) => (
                <div className='flex gap-2'>
                    <Button
                        size='icon'
                        variant='none'
                        onClick={() => dispatch({type: ActionKind.MODAL_PATIENT_DETAILS_SHOW, patient: row.original})}
                    >
                        <Icon name='person' width={20} height={20} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className='space-y-7 p-7'>
            <h1>Patients Management</h1>
            <Button onClick={onLogout}>Logout</Button>
            <div className='bg-white'>
                <DataTable data={patients} columns={columns} />
            </div>
            <ModalPatientDetails
                open={state.type === ActionKind.MODAL_PATIENT_DETAILS_SHOW}
                onClose={() => dispatch({type: ActionKind.NONE})}
                data={state.patient}
            />
        </div>
    );
}

export default PatientsPage;
