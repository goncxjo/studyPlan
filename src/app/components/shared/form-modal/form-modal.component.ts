import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() state: string;
  subjectForm: FormGroup = this.fb.group({
    id: '',
    name: '',
    state: ''
  });

  constructor(
    public activeModal: NgbActiveModal
    , private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fillForm();
  }

  private fillForm() {
    this.subjectForm.setValue({
      id: this.id || '',
      name: this.name || '',
      state: this.state || ''
    });
  }

  private onSubmit() {
    this.activeModal.close(this.subjectForm.value);
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }
}
