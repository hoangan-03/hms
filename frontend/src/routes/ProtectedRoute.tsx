import {useEffect} from 'react';
import {Navigate, Outlet, useLocation, useNavigate} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';

import {ENUM_ROUTES} from './routes.enum';

const ProtectedRoute = () => {
    const {
        state: {isAuth, didClickLogout, isLoading},
    } = useAuthContext();
    const navigate = useNavigate();

    const {pathname, search} = useLocation();
    const redirectUrl = search ? pathname + search : pathname;

    useEffect(() => {
        if (isAuth === false && !isLoading) {
            console.log('this runs?');
            let navigateTo = ENUM_ROUTES.LOGIN as string;
            if (!didClickLogout) navigateTo += `?redirect-url=${encodeURIComponent(redirectUrl)}`;
            navigate(navigateTo, {replace: true});
            // return <Navigate to={navigateTo} replace />;
        }
    }, [isAuth, isLoading, navigate, didClickLogout, redirectUrl]);

    return <Outlet />;
};

export default ProtectedRoute;
