import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';

import {ENUM_ROUTES} from './routes.enum';

const AuthRoute = () => {
    const navigate = useNavigate();
    const {
        state: {isAuth, isLoading},
    } = useAuthContext();

    useEffect(() => {
        if (isAuth && !isLoading) {
            console.log('this runs?');
            navigate(ENUM_ROUTES.HOME);
        }
    }, [navigate, isAuth, isLoading]);

    return <Outlet />;
};

export default AuthRoute;
