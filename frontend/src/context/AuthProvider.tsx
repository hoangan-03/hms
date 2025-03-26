import {createContext, ReactNode, useContext, useEffect, useState} from 'react';

import {IProfile} from '@/modules/auth/auth.interface';
import {useGetProfile} from '@/modules/auth/auth.swr';

// import {useProfileSwr} from '@/modules/auth/auth.swr';
// import {Authentication} from '@/modules/auth/auth.type';
// import {IAdmin} from '@/modules/user/user.interface';

type Authentication = {
    user: IProfile | null;
    didClickLogout: boolean;
    mutateUser: () => void;
    setIsAuth: (value: boolean) => void;
    setDidClickLogout: (value: boolean) => void;
};

const initialState: Authentication = {
    user: null,
    didClickLogout: false,
    mutateUser: () => {},
    setIsAuth: () => {},
    setDidClickLogout: () => {},
};

const AuthContext = createContext<Authentication>(initialState);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const token = localStorage.getItem('token');
    const [isAuth, setIsAuth] = useState<boolean>(!!token);
    const {data, mutate: mutateUser, error} = useGetProfile(isAuth);
    const [didClickLogout, setDidClickLogout] = useState<boolean>(false);

    useEffect(() => {
        if (isAuth && error && !token) {
            setIsAuth(false);
        }
    }, [isAuth, error, token]);

    return (
        <AuthContext.Provider
            value={{user: data?.data as IProfile, didClickLogout, mutateUser, setIsAuth, setDidClickLogout}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
