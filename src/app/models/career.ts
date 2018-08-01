export class Career {
  $key?: string;
  name?: string;
  length?: number;
  level?: any;
  about?: string;
  goals?: string;
  universityId?: string;
  departmentId?: [any];
  options?: [any];
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