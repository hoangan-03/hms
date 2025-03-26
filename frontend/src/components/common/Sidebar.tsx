import {ReactNode} from 'react';
import {Link, useLocation} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';
import {cn} from '@/lib/utils';
import {ROLE} from '@/modules/auth/auth.enum';
import {ENUM_ROUTES} from '@/routes/routes.enum';

import {Button} from '../ui';
import Icon from './Icon';

type SidebarContent = {
    label: string;
    route: ENUM_ROUTES;
    icon: ReactNode;
    role: ROLE[];
};

const sidebarContent: SidebarContent[] = [
    {
        label: 'Appointments',
        route: ENUM_ROUTES.HOME,
        icon: <Icon name='calendar' width={20} height={20} />,
        role: Object.values(ROLE),
    },
    {
        label: 'Patients',
        route: ENUM_ROUTES.PATIENTS,
        icon: <Icon name='two-people' width={20} height={20} />,
        role: [ROLE.DOCTOR],
    },
];

function Sidebar() {
    const {
        state: {user},
    } = useAuthContext();

    const location = useLocation();
    const currentRoute = location.pathname as ENUM_ROUTES;

    return (
        <nav className='h-full w-full'>
            <ul className='flex flex-col'>
                {sidebarContent.map(
                    (item, index) =>
                        user?.role &&
                        item.role.includes(user.role) && (
                            <li key={index}>
                                <Link to={item.route}>
                                    <Button
                                        variant='none'
                                        size='none'
                                        className={cn(
                                            'hover:text-primary w-full justify-start gap-4 rounded-none p-4 hover:underline',
                                            currentRoute === item.route
                                                ? 'border-primary bg-primary-light/50 text-primary border-l-4'
                                                : 'pl-5'
                                        )}
                                    >
                                        {item.icon}
                                        <span className='font-semibold'>{item.label}</span>
                                    </Button>
                                </Link>
                            </li>
                        )
                )}
            </ul>
        </nav>
    );
}

export default Sidebar;
