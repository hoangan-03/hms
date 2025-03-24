import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';

import {ENUM_ROUTES} from './routes.enum';

const AuthRoute = () => {
    const navigate = useNavigate();
    const {user, setIsAuth} = useAuthContext();
    // In case when useSwr is undefined upon first render.
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user && token) {
            setIsAuth(true);
            navigate(ENUM_ROUTES.HOME);
        }
    }, [user, token, navigate, setIsAuth]);

    return <Outlet />;
};

export default AuthRoute;
