import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-boolean-selector',
  templateUrl: './boolean-selector.component.html',
  styleUrls: ['./boolean-selector.component.css']
})
export class BooleanSelectorComponent {

  @Input() public parent: FormGroup;
  @Input() public name: string;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  constructor() { }

  change(newValue) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }
}
