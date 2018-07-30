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
  quantityApproved: number = 0;
}