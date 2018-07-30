import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubjectService } from '../../../services/subject.service';
import { State } from '../../../models/subject';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.css']
})
export class StateSelectorComponent implements OnInit {
  @Input() public parent: FormGroup;
  @Input() public name: string;

  states: State[];

  constructor(private subjectService: SubjectService) { }

  ngOnInit() {
    this.getStates();
  }
  
  getStates() {
  //   this.subjectService.getStates()
  //   .subscribe(states => {
  //     this.states = states});
  }
}
