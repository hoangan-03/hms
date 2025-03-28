import {createContext, ReactNode, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {useAxiosInterceptorContext} from '@/lib/axios/AxiosInterceptor';
import {OAUTH_PROVIDER} from '@/modules/auth/auth.enum';
import {ILoginRequest, IProfile} from '@/modules/auth/auth.interface';
import {AuthService} from '@/modules/auth/auth.service';
import {useGetProfile} from '@/modules/auth/auth.swr';
import {ENUM_ROUTES} from '@/routes/routes.enum';

type Authentication = {
    state: {
        isAuth: boolean;
        user: IProfile | null;
        didClickLogout: boolean;
        isLoading: boolean;
    };
    onLogin: (data: ILoginRequest) => void;
    onLoginOAuth: (provider: OAUTH_PROVIDER) => void;
    onLogout: () => void;
    mutateUser: () => void;
    setDidClickLogout: (value: boolean) => void;
};

const initialState: Authentication = {
    state: {
        isAuth: false,
        user: null,
        didClickLogout: false,
        isLoading: false,
    },
    onLogin: () => {},
    onLogout: () => {},
    onLoginOAuth: () => {},
    mutateUser: () => {},
    setDidClickLogout: () => {},
};

const AuthContext = createContext<Authentication>(initialState);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const {data, mutate: mutateUser, error, isLoading} = useGetProfile();
    const {
        state: {isUnauthorized},
        resetState,
    } = useAxiosInterceptorContext();
    const isAuth = !isLoading && !!data?.id && !error && !isUnauthorized;
    const [didClickLogout, setDidClickLogout] = useState<boolean>(false);

    const navigate = useNavigate();

    const onLogin = async (data: ILoginRequest) => {
        try {
            await AuthService.login(data);
            await mutateUser();
            resetState();
            navigate(ENUM_ROUTES.HOME, {replace: true});
            toast.success('Login successful');
        } catch (error) {
            console.error(error);
            toast.error('Login failed');
        } finally {
            setDidClickLogout(false);
        }
    };

    const onLoginOAuth = (provider: OAUTH_PROVIDER) => {
        if (provider === OAUTH_PROVIDER.GOOGLE) {
            window.location.href = AuthService.ROUTES.LOGIN_GOOGLE;
        }
        if (provider === OAUTH_PROVIDER.FACEBOOK) {
            window.location.href = AuthService.ROUTES.LOGIN_FACEBOOK;
        }
    };

    const onLogout = async () => {
        try {
            await AuthService.logout();
            await mutateUser();
            navigate(ENUM_ROUTES.LOGIN, {replace: true});
            toast.success('Logout successful');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                state: {user: data as IProfile, isAuth, didClickLogout, isLoading},
                onLogin,
                onLogout,
                onLoginOAuth,
                mutateUser,
                setDidClickLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
