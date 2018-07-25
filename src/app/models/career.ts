import { Orientation } from "src/app/models/orientation";
import { Subject } from "src/app/models/subject";

export class Career {
    $key: string;
    name: string;
    length: number;
    // orientations: Orientation[];
    syllabus: Subject[];
}
