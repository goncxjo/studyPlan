import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css']
})
export class StateSelectorComponent {
  @Input() public parent: FormGroup;
  @Input() public name: string;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  states: any[];

  constructor(private subjectService: SubjectService) {
    this.states = this.subjectService.getStates();
  }

  change(newValue) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }
}
