export class Career {
    $key?: string;
    name?: string;
    length?: number;
    level?: string;
    about?: string;
    goals?: string;
    options?: [Option];
    syllabus?: [string];
    departments?: [string];
    university?: string;
}

export class Level {
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

export class Option {
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

export const LEVELS: Level[] = [
    new Level('grade', 'Grado'),
    new Level('posgrade', 'Posgrado')
];
