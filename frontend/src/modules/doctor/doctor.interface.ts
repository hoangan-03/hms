import {ROLE} from '../auth/auth.enum';
import {BaseEntity} from '../common.interface';

export interface IDoctor extends BaseEntity {
    id: number;
    name: string;
    username: string;
    phoneNumber: string;
    role: ROLE;
}
