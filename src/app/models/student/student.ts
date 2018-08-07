export class StudentMiniList {
  $key = '';
  studentId = '';
  name = '';
  universityId = '';
  careerId = '';
  careerOptionId = '';
}

export class StudentList {
  $key = '';
  studentId = '';
  name = '';
  age = 0;
  universityId = '';
  careerId = '';
  careerOptionId = '';
  universityName = '';
  careerName = '';
  careerOptionName = '';
}

export class StudentForm {
  $key?: string;
  name: string;
  age: number;
  studentId: string;
  universityId: string;
  careerId: string;
  careerOptionId: string;
}

export class Student {
  $key?: string;
  name?: string;
  age?: number;
  studentId?: string;
  universityId?: string;
  careerId?: string;
  careerOptionId?: string;
  approved?: [string];
  regularized?: [string];
  quantityApproved = 0;
}
