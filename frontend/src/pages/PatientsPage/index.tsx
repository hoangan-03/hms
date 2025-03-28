import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useReducer, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {DataTable, Icon, Pagination} from '@/components/common';
import {Button, ScrollArea, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize, cn, formatId} from '@/lib/utils';
import {PaginationRequest} from '@/modules/api.interface';
import {GENDER, ROLE} from '@/modules/auth/auth.enum';
import {IPatient} from '@/modules/patient/patient.interface';
import {useGetPatients} from '@/modules/patient/patient.swr';
import {ENUM_ROUTES} from '@/routes/routes.enum';

import ModalPatientDetails from './ModalPatientDetails';

enum ActionKind {
    MODAL_PATIENT_DETAILS_SHOW = 'MODAL_PATIENT_DETAILS_SHOW',
    NONE = 'NONE',
}

type ShowPatientDetailsModalPayload = {
    patient: IPatient;
};

interface Action<T = undefined> {
    type: ActionKind;
    payload?: T;
}

interface State {
    type: ActionKind;
    patient?: IPatient;
}

const actions = {
    showPatientDetailsModal: (patient: IPatient): Action<ShowPatientDetailsModalPayload> => ({
        type: ActionKind.MODAL_PATIENT_DETAILS_SHOW,
        payload: {patient},
    }),
    closeModal: (): Action => ({
        type: ActionKind.NONE,
    }),
};

const reducer = (state: State, action: Action<unknown>): State => {
    switch (action.type) {
        case ActionKind.MODAL_PATIENT_DETAILS_SHOW:
            return {
                ...state,
                type: ActionKind.MODAL_PATIENT_DETAILS_SHOW,
                patient: (action.payload as ShowPatientDetailsModalPayload).patient,
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
        state: {user, isLoading},
    } = useAuthContext();
    const navigate = useNavigate();

    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        perPage: 10,
    });

    useEffect(() => {
        if (user?.role !== ROLE.DOCTOR && !isLoading) {
            navigate(ENUM_ROUTES.HOME, {replace: true});
        }
    }, [navigate, user, isLoading]);

    const {data, mutate} = useGetPatients(pagination);
    const patients = data?.data || [];
    const paginationData = data?.pagination;

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
                                <p>{capitalize(row.original.gender || GENDER.OTHER)}</p>
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
                        onClick={() => dispatch(actions.showPatientDetailsModal(row.original))}
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
            <div className='rounded-md bg-white'>
                <ScrollArea className={cn('py-1', patients.length <= 8 ? 'h-fit' : 'h-[60vh]')}>
                    <DataTable data={patients} columns={columns} />
                    <Separator className='bg-black' />
                    {patients && paginationData && paginationData.totalItems > 0 && (
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
            <ModalPatientDetails
                open={state.type === ActionKind.MODAL_PATIENT_DETAILS_SHOW}
                onClose={() => dispatch(actions.closeModal())}
                data={state.patient}
                onSubmitSuccess={() => {
                    mutate();
                    setPagination({...pagination, page: 1});
                }}
            />
        </div>
    );
}

export default PatientsPage;
