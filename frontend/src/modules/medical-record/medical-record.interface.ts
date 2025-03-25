import {BaseEntity} from '../common.interface';

export interface IMedicalRecord extends BaseEntity {
    id: number;
    diagnosis: string;
    recordDate: string; // 'YYYY-MM-DD'
}
