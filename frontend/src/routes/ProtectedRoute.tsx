import {Navigate, Outlet, useLocation} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';

import {ENUM_ROUTES} from './routes.enum';

const ProtectedRoute = () => {
    const {
        state: {isAuth, didClickLogout, isLoading},
    } = useAuthContext();

    const {pathname, search} = useLocation();
    const redirectUrl = search ? pathname + search : pathname;

    if (isAuth === false && !isLoading) {
        let navigateTo = ENUM_ROUTES.LOGIN as string;
        if (!didClickLogout) navigateTo += `?redirect-url=${encodeURIComponent(redirectUrl)}`;
        return <Navigate to={navigateTo} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
