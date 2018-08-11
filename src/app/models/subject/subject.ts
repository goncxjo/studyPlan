import { Correlatives } from './correlatives';

export class SubjectMiniList {
    $key = '';
    code = '';
    name = '';
    universityId = '';
    careerId = '';
    careerOptions = [];
    isCrossDisciplinary = false;
}

export class SubjectList {
    $key = '';
    code = '';
    name = '';
    year?: number;
    quarter?: number;
    classLoad = 0;
    credits = 0;
    universityId = '';
    careerId = '';
    careerOptions = [];
    isCrossDisciplinary = false;
}

export class SubjectForm {
    $key?: string;
    code?: string;
    name: string;
    year: number;
    quarter: number;
    classLoad: number;
    credits?: number;
    correlatives: Correlatives;
    universityId: string;
    careerId: string;
    careerOptions: string;
    isCrossDisciplinary: boolean;
}

export class SubjectMiniForm {
    id?: string;
    name: string;
    state?: string;
}

export class Subject {
    $key?: string;
    code?: string;
    name?: string;
    year?: number;
    quarter?: number;
    classLoad?: number;
    credits?: number;
    correlatives?: Correlatives;
    universityId?: string;
    careerId?: string;
    careerOptions?: string;
    isCrossDisciplinary: boolean;
}
