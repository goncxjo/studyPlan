export class Subject {
    $key?: string;
    name?: string;
    code?: string;
    year?: number;
    quarter?: number;
    classLoad?: number;
    credits?: number;
    // state?: string;
    correlatives?: {
      approved?: [any];
      regularized?: [any];
    };
    plan?: number;
    universityId?: string;
    careerId?: string;
    careerOptions?: string;
}

export class SubjectCorrelative {
    $key?: string;
    fromSubject?: string;
    universityId?: string;
    careerId?: string;
    careerOptionId?: string;
}

export class State {
    key: string;
    value: string;

    constructor(key: string, value: string) {
      this.key = key
      this.value = value
    }

    getValue() {
      return this.value;
    }
}

export const STATES: State[] = [
    new State('available', 'Disponible'),
    new State('notApproved', 'No disponible'),
    new State('inProgress', 'En curso'),
    new State('regularized', 'Regularizada'),
    new State('approved', 'Aprobada')
];