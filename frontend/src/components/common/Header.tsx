import {ReactNode} from 'react';
import {Link} from 'react-router-dom';

import avatar from '@/assets/images/avatar.png';
import {useAuthContext} from '@/context/AuthProvider';
import {capitalize} from '@/lib/utils';
import {ENUM_ROUTES} from '@/routes/routes.enum';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui';
import {Icon} from '.';

interface DropdownItem {
    label: string;
    link?: ENUM_ROUTES;
    icon?: ReactNode;
    onClick?: () => void;
}

function Header() {
    const {
        state: {user},
        onLogout,
    } = useAuthContext();

    const dropDownItems: DropdownItem[] = [
        {
            label: 'Profile',
            link: ENUM_ROUTES.HOME,
        },
        {
            label: 'Logout',
            onClick: onLogout,
        },
    ];

    return (
        <div className='container'>
            <div className='flex h-[70px] items-center justify-between py-3 pr-8 pl-[60px]'>
                <img src='/images/logo.png' alt='Logo' width={70} />
                <div className='flex items-center gap-6'>
                    <Avatar>
                        <AvatarImage src={avatar} />
                        <AvatarFallback />
                    </Avatar>
                    <div className='space-y-1'>
                        <p className='text-404040 font-bold'>{user?.name}</p>
                        <p className='text-xs font-semibold'>{capitalize(user?.role || '')}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='none' size='none' className='border-5c5c5c size-5 rounded-full border p-1'>
                                <Icon name='caret-down' width={16} height={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' sideOffset={8} className='bg-white'>
                            {dropDownItems.map((item, index) =>
                                item.link ? (
                                    <DropdownMenuItem key={index}>
                                        <Link to={item.link}>
                                            <p>{item.label}</p>
                                            {item.icon}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    item.onClick && (
                                        <DropdownMenuItem key={index} onClick={item.onClick}>
                                            {item.label}
                                        </DropdownMenuItem>
                                    )
                                )
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

export default Header;
