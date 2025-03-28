import {axiosInstance} from '@/lib/axios/axios';

import {ResponseAPI} from '../api.interface';
import {APIBaseService} from '../main.service';
import {IAuthToken, ILoginRequest, IProfile, IRegisterRequest, IRegisterResponse} from './auth.interface';

export class AuthService extends APIBaseService {
    public static readonly ROUTES = {
        LOGIN: APIBaseService.BASE_URL + '/auth/login',
        REGISTER: APIBaseService.BASE_URL + '/auth/register',
        ME: APIBaseService.BASE_URL + '/auth/me',
        LOGOUT: APIBaseService.BASE_URL + '/auth/logout',
        LOGIN_GOOGLE: APIBaseService.BASE_URL + '/auth/google',
        LOGIN_FACEBOOK: APIBaseService.BASE_URL + '/auth/facebook',
    };

    public static async login(payload: ILoginRequest) {
        return await axiosInstance.post<IAuthToken>(AuthService.ROUTES.LOGIN, payload);
    }

    public static async register(payload: IRegisterRequest) {
        return await axiosInstance.post<IRegisterResponse>(AuthService.ROUTES.REGISTER, payload);
    }

    public static async profile() {
        return await axiosInstance.get<IProfile>(AuthService.ROUTES.ME).then((res) => res.data);
    }

    public static async logout() {
        return await axiosInstance.post<ResponseAPI<undefined>>(AuthService.ROUTES.LOGOUT);
    }

    public static async loginGoogle() {
        return await axiosInstance.get<null>(AuthService.ROUTES.LOGIN_GOOGLE);
    }

    public static async loginFacebook() {
        return await axiosInstance.get<null>(AuthService.ROUTES.LOGIN_FACEBOOK);
    }
}
