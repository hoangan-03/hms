export abstract class APIBaseService {
    protected static readonly BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // protected static readonly API_VERSION = import.meta.env.VITE_API_VERSION;
    // protected static readonly API_URL = `${APIBaseService.BASE_URL}/${APIBaseService.API_VERSION}`;
    protected static readonly API_URL = `${APIBaseService.BASE_URL}`;
}
