import {useAuthContext} from '@/context/AuthProvider';

import DoctorPage from './DoctorPage';
import PatientPage from './PatientPage';

enum ROLE {
    DOCTOR = 'doctor',
    PATIENT = 'patient',
}

function HomePage() {
    const {state} = useAuthContext();
    const role = state.user?.role;

    return role === ROLE.DOCTOR ? <DoctorPage /> : <PatientPage />;
}

export default HomePage;
