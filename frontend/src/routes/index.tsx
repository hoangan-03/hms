import {createBrowserRouter, Outlet} from 'react-router-dom';

import {ErrorElement} from '@/components/common';
import {AuthProvider} from '@/context/AuthProvider';
import * as Layout from '@/layouts';
import AxiosInterceptor from '@/lib/axios/AxiosInterceptor';
import * as Page from '@/pages';

import AuthRoute from './AuthRoute';
import ProtectedRoute from './ProtectedRoute';
import {ENUM_ROUTES} from './routes.enum';

const Root = () => (
    <AuthProvider>
        <Outlet />
    </AuthProvider>
);

const protectedRoutes = [
    {
        path: ENUM_ROUTES.HOME,
        element: <Page.HomePage />,
    },
    {
        path: ENUM_ROUTES.PATIENTS,
        element: <Page.PatientsPage />,
    },
];

const authRoutes = [
    {
        path: ENUM_ROUTES.LOGIN,
        element: <Page.LoginPage />,
    },
];

const router = createBrowserRouter([
    {
        element: <AxiosInterceptor />,
        errorElement: <ErrorElement />,
        children: [
            {
                element: <Root />,
                children: [
                    {
                        element: <ProtectedRoute />,
                        children: [
                            {
                                element: <Layout.MainLayout />,
                                children: [...protectedRoutes],
                            },
                        ],
                    },
                    {
                        element: <AuthRoute />,
                        children: [
                            {
                                element: <Layout.AuthLayout />,
                                children: [...authRoutes],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default router;
