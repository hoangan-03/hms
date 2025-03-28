import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {useAuthContext} from '@/context/AuthProvider';
import {ENUM_ROUTES} from '@/routes/routes.enum';

function OAuthCallbackPage() {
    const {mutateUser} = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthResponse = async () => {
            try {
                await mutateUser();
                await navigate(ENUM_ROUTES.HOME);
            } catch (error) {
                console.error('OAuth error:', error);
                navigate(ENUM_ROUTES.LOGIN, {replace: true});
            }
        };

        handleOAuthResponse();
    }, [mutateUser, navigate]);

    return <div>Processing login...</div>;
}

export default OAuthCallbackPage;
