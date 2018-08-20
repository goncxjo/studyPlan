import { Injectable } from '@angular/core';

import { DataSet } from 'vis';
import * as _ from 'lodash';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalComponent } from '../components/shared/form-modal/form-modal.component';

import { SubjectService } from './subject.service';
import { StudentService } from './student.service';
import { Subject } from '../models/subject/subject';
import { Student } from '../models/student/student';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  // dataset: Observable<{ nodes: DataSet, links: DataSet }>;
  subjects: Subject[];
  student: Student;
  dataset: { nodes: any, links: any, numberOfQuarters: any, maxNodesQuarter: any };
  numberOfQuarters: number;
  maxNodesQuarter: number;

  constructor(
    // private subjectService: SubjectService
    // , private studentService: StudentService
    // , private modalService: NgbModal
  ) { }

  set(student: Student, subjects: Subject[]) {
    this.student = student || new Student();
    this.subjects = subjects || [] as Subject[];
  }

  getDataSet() {
    let links = [];
    this.numberOfQuarters = 0;
    this.maxNodesQuarter = 0;
    const nodes = this.subjects
    .map(element => {
      const node = this.generateNode(element);
      links = this.getLinks(element, links);
      return node;
    });
    const numberOfQuarters = this.numberOfQuarters;
    const maxNodesQuarter = this.maxNodesQuarter;
    this.dataset = { nodes, links, numberOfQuarters, maxNodesQuarter };
    return this.dataset;
  }

  generateNode(subject) {
    const subjectsPerQuarter = this.subjects.filter(x => x.quarter === subject.quarter);
    this.numberOfQuarters = Math.max(this.numberOfQuarters, subject.quarter);
    this.maxNodesQuarter = Math.max(this.maxNodesQuarter, subjectsPerQuarter.length);

    return {
      id: subject.$key,
      name: subject.name,
      quarter: subject.quarter,
      year: subject.year,
      group: subject.year,
      state: this.student['$key'] ? this.getSubjectState(subject) : null,
      xPos: subject.quarter,
      yPos: subjectsPerQuarter.findIndex(x => x.$key === subject.$key),
      nodesPerQuarter: subjectsPerQuarter.length
    };
  }

  getSubjectState(subject: Subject) {
    let state = null; //'notAvailable';
    const subjectKey = subject.$key;

    const correlatives = subject.correlatives || { approved: [], regularized: [] };
    const approved = correlatives['approved'] || [];
    const regularized = correlatives['regularized'] || [];
    const realRegularized = _.difference(regularized, approved);

    const studentApproved = this.student['approved'] || [];
    const studentRegularized = this.student['regularized'] || [];
    const studentInProgress = this.student['inProgress'] || [];

    const isApproved = _.includes(studentApproved, subjectKey);
    const isRegularized = _.includes(studentRegularized, subjectKey);
    const isInProgress = _.includes(studentInProgress, subjectKey);
    const isAvailable = approved.every((key) => _.includes(studentApproved, key));

    if (isApproved) {
      state = 'approved';
    } else if (isRegularized) {
      state = 'regularized';
    } else if (isInProgress) {
      state = 'inProgress';
    } else if (isAvailable) {
      state = 'available';
    }
    return state;
  }

  getLinks(subject, links) {
    const correlatives = subject.correlatives || { approved: [], regularized: [] };
    const approved = correlatives['approved'] || [];
    const regularized = correlatives['regularized'] || [];
    const realRegularized = _.difference(regularized, approved);

    approved.forEach(i => {
      links.push({
        source: i,
        target: subject.$key,
        distance: subject.year
      });
    });

    realRegularized.forEach(i => {
      links.push({
        source: i,
        target: subject.$key,
        distance: subject.year
      });
    });

    return links;
  }

  getSubjectName(subjectKey) {
    return this.subjects.find(s => s.$key === subjectKey).name;
  }
}
