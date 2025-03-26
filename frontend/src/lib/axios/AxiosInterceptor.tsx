import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

// import {ACCESS_TOKEN_EXPIRES_IN_MINUTES} from '@/constants/common';
// import {timeZoneOptions} from '@/constants/dateTime';
// import {IAuthToken} from '@/modules/auth/auth.interface';
import {ENUM_ROUTES} from '@/routes/routes.enum';

import {axiosInstance} from './axios';

// const isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// function onRefreshTokenComplete(newToken: string) {
//     refreshSubscribers.forEach((callback) => callback(newToken));
//     refreshSubscribers = [];
// }

// function addRefreshSubscriber(callback: (token: string) => void) {
//     refreshSubscribers.push(callback);
// }

const showToastError = (error: string, toastId: string) => {
    if (!toast.isActive(toastId)) {
        toast.error(error, {toastId});
    }
};

function AxiosInterceptor() {
    const [hasIntercepted, setHasIntercepted] = useState<boolean>(false);
    const navigate = useNavigate();

    const {pathname, search} = useLocation();
    const redirectUrl = search ? pathname + search : pathname;

    // const refreshToken = useCallback(async (token: IAuthToken & {rememberMe: boolean}) => {
    //     const expirationDate =
    //         new Date(token.createdAt).getTime() + token.expiresIn * 1000 - ACCESS_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000;
    //     const currentDate = new Date(new Intl.DateTimeFormat('en-US', timeZoneOptions).format(new Date())).getTime();

    //     if (expirationDate < new Date(currentDate).getTime() && token.rememberMe === true) {
    //         const payload: IRefreshTokenRequest = {
    //             refreshToken: token.refreshToken,
    //         };
    //         const response = await AuthService.refreshToken(payload);
    //         const data = response.data.data;

    //         token = {...data, rememberMe: token.rememberMe};

    //         // localStorage.setItem('token', JSON.stringify(token));
    //     }
    //     return token;
    // }, []);

    useEffect(() => {
        const successRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
            // const tokenString = localStorage.getItem('token');
            // if (tokenString) {
            //     const token: IAuthToken & {rememberMe: boolean} = JSON.parse(tokenString);
            //     config.headers.Authorization = `${token.tokenType} ${token.accessToken}`;
            // }
            return config;
        };

        const errorRequestInterceptor = (error: AxiosError) => {
            return Promise.reject(error);
        };

        const successResponseInterceptor = (response: AxiosResponse) => {
            return response;
        };

        const errorResponseInterceptor = async (error: AxiosError) => {
            console.log('error', error);
            const toastId = 'error';
            if (error.code === 'ERR_NETWORK' && error.message === 'Network Error') {
                showToastError('Network Error', toastId);
                return Promise.reject(error);
            }
            if (error.response) {
                const status = error.response.status;
                switch (status) {
                    case 401:
                        {
                            // try {
                            //     if (error.config?.url === AuthService.ROUTES.refreshToken) {
                            //         throw error;
                            //     } else {
                            //         // Add API callback to queue
                            //         new Promise<string>((resolve) => {
                            //             addRefreshSubscriber(resolve);
                            //         });

                            //         if (!isRefreshing) {
                            //             try {
                            //                 isRefreshing = true;

                            //                 // Get new token
                            //                 // const tokenString = localStorage.getItem('token') || '';
                            //                 const token: IAuthToken & {rememberMe: boolean} = JSON.parse(tokenString);
                            //                 if (token.rememberMe === false) {
                            //                     toast.error('Session expired');
                            //                     throw error;
                            //                 }
                            //                 const newToken = await refreshToken(token);

                            //                 // Call API callback with new token
                            //                 onRefreshTokenComplete(newToken.accessToken);
                            //             } catch (error) {
                            //                 refreshSubscribers = [];
                            //                 throw error;
                            //             } finally {
                            //                 isRefreshing = false;
                            //             }
                            //         }
                            //     }
                            // } catch (error) {
                            //     // localStorage.clear();
                            //     refreshSubscribers = [];
                            //     let navigateTo = ENUM_ROUTES.LOGIN as string;
                            //     navigate((navigateTo += `?redirect-url=${encodeURIComponent(redirectUrl)}`));
                            // }
                            let navigateTo = ENUM_ROUTES.LOGIN as string;
                            navigate((navigateTo += `?redirect-url=${encodeURIComponent(redirectUrl)}`));
                        }
                        break;
                    case 403:
                        // showToastError('Forbidden', toastId);
                        break;
                    case 404:
                        // showToastError('Not Found', toastId);
                        break;
                    case 422:
                        // showToastError('Unprocessable Entity', toastId);
                        break;
                    case 500:
                        // showToastError('Internal Server Error', toastId);
                        break;
                    case 503:
                        // showToastError('Service Unavailable', toastId);
                        break;
                    case 504:
                        // showToastError('Gateway Timeout', toastId);
                        break;
                    default:
                        break;
                }
                return Promise.reject(error);
            }
            // showToastError('Unknown Error', toastId);
            return Promise.reject(error);
        };

        const requestInterceptor = axiosInstance.interceptors.request.use(
            successRequestInterceptor,
            errorRequestInterceptor
        );
        const responseInterceptor = axiosInstance.interceptors.response.use(
            successResponseInterceptor,
            errorResponseInterceptor
        );

        // useEffect runs asynchronously with children --> may not finished setting interceptor before rendering children
        setHasIntercepted(true);

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate, redirectUrl]);

    return hasIntercepted && <Outlet />;
}

export default AxiosInterceptor;
