import avatar from '@/assets/images/avatar.png';

import {Avatar, AvatarFallback, AvatarImage, Button} from '../ui';
import {Icon} from '.';

function Header() {
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
                        <p className='text-404040 font-bold'>Moni Roy</p>
                        <p className='text-xs font-semibold'>Doctor</p>
                    </div>
                    <Button variant='none' size='none' className='border-5c5c5c size-5 rounded-full border p-1'>
                        <Icon name='caret-down' width={16} height={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Header;
