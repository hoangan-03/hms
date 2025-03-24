import {Outlet} from 'react-router-dom';

function AuthLayout() {
    return (
        <div className='bg-gray-50'>
            <div className='relative container grid min-h-screen grid-cols-12'>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
