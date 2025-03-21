import {useEffect} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';

import {ENUM_ROUTES} from './routes.enum';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const {user, setIsAuth, didClickLogout} = useAuthContext();

    const {pathname, search} = useLocation();
    const redirectUrl = search ? pathname + search : pathname;

    // In case when useSwr is undefined upon first render.
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!user && !token) {
            setIsAuth(false);
            let navigateTo = ENUM_ROUTES.LOGIN as string;
            if (!didClickLogout) navigateTo += `?redirect-url=${encodeURIComponent(redirectUrl)}`;
            navigate(navigateTo);
        }
    }, [user, token, navigate, setIsAuth, didClickLogout, redirectUrl]);
    return <Outlet />;
};

export default ProtectedRoute;
