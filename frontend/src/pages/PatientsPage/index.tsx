import {ColumnDef} from '@tanstack/react-table';
import {useReducer} from 'react';

import {DataTable} from '@/components/common';
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
        name: 'John Doe',
        email: 'example@gmail.com',
        phone: '1234567890',
        address: '123 Main St',
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'example2@gmail.com',
        phone: '0987654321',
        address: '456 Main St',
    },
    {
        id: 3,
        name: 'John Smith',
        email: 'example3@gmail.com',
        phone: '1234567890',
        address: '789 Main St',
    },
];

function PatientsPage() {
    const [state, dispatch] = useReducer(reducer, {type: ActionKind.NONE});
    // const [state, dispatch] = useReducer(reducer, {type: ActionKind.MODAL_PATIENT_DETAILS_SHOW, patient: patients[0]});

    const columns: ColumnDef<IPatient>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({row}) => (
                <div>
                    <span
                        className='cursor-pointer underline'
                        onClick={() => dispatch({type: ActionKind.MODAL_PATIENT_DETAILS_SHOW, patient: row.original})}
                    >
                        {row.original.id}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({row}) => <div>{row.original.name}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({row}) => <div>{row.original.email}</div>,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({row}) => <div>{row.original.phone}</div>,
        },
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({row}) => <div>{row.original.address}</div>,
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
