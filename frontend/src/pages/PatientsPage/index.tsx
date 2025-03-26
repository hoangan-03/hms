import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useReducer} from 'react';
import {useNavigate} from 'react-router-dom';

import {DataTable, Icon} from '@/components/common';
import {Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize, cn, formatId} from '@/lib/utils';
import {ROLE} from '@/modules/auth/auth.enum';
import {IPatient} from '@/modules/patient/patient.interface';
import {useGetPatients} from '@/modules/patient/patient.swr';
import {ENUM_ROUTES} from '@/routes/routes.enum';

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

function PatientsPage() {
    const [state, dispatch] = useReducer(reducer, {type: ActionKind.NONE});
    const {
        state: {user},
    } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== ROLE.DOCTOR) {
            navigate(ENUM_ROUTES.HOME, {replace: true});
        }
    }, [navigate, user]);

    const {data: patients} = useGetPatients();

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
