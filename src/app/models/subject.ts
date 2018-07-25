export class Subject {
    $key?: string;
    name?: string;
    code?: string;
    classLoad?: number;
    quarter?: number;
    state?: string;
    correlatives?: any[];
}

export class State {
    key: string;
    value: string;
}

export const STATES: State[] = [
    { key: 'available', value: 'Disponible' },
    { key: 'notApproved', value: 'No disponible' },
    { key: 'inProgress', value: 'En curso' },
    { key: 'regularized', value: 'Regularizada' },
    { key: 'approved', value: 'Aprobada' }
];