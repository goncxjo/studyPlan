export class State {
    key: string;
    value: string;

    constructor(key: string, value: string) {
      this.key = key;
      this.value = value;
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
