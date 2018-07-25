import { Component, OnInit } from '@angular/core';
import { ToastrService, Toast } from 'ngx-toastr';

import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  subjects: Subject[];

  constructor(private subjectService: SubjectService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  onDelete($key: string){
    if (confirm('Are you sure?')) {
      this.subjectService.deleteSubject($key);
      this.toastr.success("Subject deleted", "Successfull operation");
    }
  }

}
