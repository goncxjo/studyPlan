import { Headquarters } from './headquarters';
import { Department } from './department';


export class UniversityMiniList {
    $key = '';
    name = '';
}

export class UniversityList {
    $key = '';
    name = '';
}

export class UniversityForm {
    $key: string;
    name: string;
    departments?: [Department];
    headquarters?: [Headquarters];
}

export class University {
    $key?: string;
    name?: string;
    departments?: [Department];
    headquarters?: [Headquarters];
}
