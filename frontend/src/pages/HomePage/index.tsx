import {useState} from 'react';

import DoctorPage from './DoctorPage';
import PatientPage from './PatientPage';

enum ROLE {
    DOCTOR = 'doctor',
    PATIENT = 'patient',
}

function HomePage() {
    const [role, setRole] = useState<ROLE>(ROLE.PATIENT);

    return role === ROLE.DOCTOR ? <DoctorPage /> : <PatientPage />;
}

export default HomePage;
