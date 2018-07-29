import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  @Input() public parent: FormGroup;
  @Input() public name: string;
  @Input() public elements: any[];

  constructor() { }

  ngOnInit() {
  }
}
