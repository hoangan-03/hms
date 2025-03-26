import {useAuthContext} from '@/context/AuthProvider';

import DoctorHomePage from './DoctorHomePage';
import PatientHomePage from './PatientHomePage';

enum ROLE {
    DOCTOR = 'doctor',
    PATIENT = 'patient',
}

function HomePage() {
    const {state} = useAuthContext();
    const role = state.user?.role;

    return role === ROLE.DOCTOR ? <DoctorHomePage /> : <PatientHomePage />;
}

export default HomePage;
