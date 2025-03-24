import {APIBaseService} from '../main.service';

export class PatientService extends APIBaseService {
    public static readonly ROUTES = {
        PATIENTS: APIBaseService.BASE_URL + '/patients',
        PATIENTS_BY_ID: (id: number) => APIBaseService.BASE_URL + `/patients/${id}`,
    };
}
