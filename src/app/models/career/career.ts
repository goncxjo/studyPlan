import { CareerOption } from './option';

export class CareerMiniList {
  $key = '';
  name = '';
  universityId = '';
}

export class CareerList {
  $key = '';
  university?: any;
  name = '';
  length = 0;
  level?: any;
}

export class CareerForm {
  $key?: string;
  name: string;
  level: string;
  length: number;
  about: string;
  goals: string;
  universityId: string;
  departmentId: string;
  options?: [CareerOption];
}

export class Career extends CareerMiniList {
  length?: number;
  level?: any;
  about?: string;
  goals?: string;
  departmentId?: string;
  options?: [CareerOption];
}
