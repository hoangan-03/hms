import {useLocation} from 'react-router-dom';

const useQueryParams = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let page = Number(queryParams.get('page')) || 1;
    if (page < 1) {
        page = 1;
    }
    const params = {
        page,
        search: queryParams.get('search') || '',
    };
    return params;
};

export {useQueryParams};
