import {Outlet} from 'react-router-dom';

import {Header} from '@/components/common';
import {Sidebar} from '@/components/common';

function MainLayout() {
    return (
        <div className='bg-gray-100 pt-[71px]'>
            <div className='border-primary fixed top-0 z-10 w-full border-b-2 bg-white'>
                <Header />
            </div>
            <div className='container'>
                <div className='flex min-h-[calc(100vh-81px)]'>
                    <div className='w-[240px] bg-white'>
                        <aside className='sticky top-[81px]'>
                            <Sidebar />
                        </aside>
                    </div>
                    <div className='bg-secondary-light w-[calc(100%-240px)]'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
