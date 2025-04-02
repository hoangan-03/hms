import {Outlet} from 'react-router-dom';

function AuthLayout() {
    return (
        <div className='bg-gray-50'>
            <div className='relative container grid h-screen grid-cols-12 overflow-hidden'>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
