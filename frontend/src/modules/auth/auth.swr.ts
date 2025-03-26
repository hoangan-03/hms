import useSwr from 'swr';

import {AuthService} from './auth.service';

function useGetProfile(shouldFetch: boolean = true) {
    const url = AuthService.ROUTES.ME;

    const {data, mutate, error, isLoading, isValidating} = useSwr(
        shouldFetch ? {key: url} : null,
        AuthService.profile,
        {
            revalidateOnFocus: false,
            keepPreviousData: false,
        }
    );

    return {data, mutate, error, isLoading, isValidating};
}

export {useGetProfile};
