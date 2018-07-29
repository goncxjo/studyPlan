export class Career {
  $key?: string;
  name?: string;
  length?: number;
  level?: string;
  about?: string;
  goals?: string;
  departments?: [any];
  options?: [any];
  universityId?: string;
}

export class CareerOption {
  $key?: string;
  name?: string;
  careerId?: string;
}

export const LEVELS = [
    { key: 'grade', value: 'Grado'},
    { key: 'posgrade', value: 'Posgrado'}
];