export class Career {
    $key?: string;
    name?: string;
    length?: number;
    level?: string;
    about?: string;
    goals?: string;
}

export const LEVELS = [
    { key: 'grade', value: 'Grado'},
    { key: 'posgrade', value: 'Posgrado'}
];
