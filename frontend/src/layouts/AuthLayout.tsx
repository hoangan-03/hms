import {Outlet} from 'react-router-dom';

function AuthLayout() {
    return (
        <div className='bg-grey-F9F9FC'>
            <div className='relative container grid min-h-screen grid-cols-12 bg-white'>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
