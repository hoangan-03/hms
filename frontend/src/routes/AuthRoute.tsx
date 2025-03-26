import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';

import {ENUM_ROUTES} from './routes.enum';

const AuthRoute = () => {
    const navigate = useNavigate();
    const {
        state: {isAuth},
    } = useAuthContext();

    useEffect(() => {
        if (isAuth) {
            navigate(ENUM_ROUTES.HOME);
        }
    }, [navigate, isAuth]);

    return <Outlet />;
};

export default AuthRoute;
