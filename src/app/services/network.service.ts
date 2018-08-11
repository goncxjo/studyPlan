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

  dataset: Observable<{ nodes: DataSet, edges: DataSet }>;
  subjects: Subject[];
  student: Student;

  constructor(
    private subjectService: SubjectService
    , private studentService: StudentService
    , private modalService: NgbModal
  ) {
  }

  generateDataSet(student, universityId, careerId, careerOptionId) {
    return this.dataset = this.subjectService.getSubjects().pipe(
      tap(subjects => {
        this.subjects = subjects;
        this.student = student;
      }),
      map(subjects => {
        let edges = [];
        const nodes = subjects
          .filter(s => {
            const matchesUniversity = s.universityId === universityId;
            const matchesCareer = (s.careerId === careerId || s.isCrossDisciplinary);
            return matchesUniversity && matchesCareer && this.isEmptyOrContainsSelectedOption(s, careerOptionId);
          })
          .map(element => {
            const node = this.generateNode(element, student);
            edges = this.getEdges(element, edges);
            return node;
          });
        return {
          nodes: new DataSet(nodes),
          edges: new DataSet(edges),
        };
      }));
  }

  getDataSet(student, universityId, careerId, careerOptionId) {
    let edges = [];
    const nodes = (this.subjects || [])
    .filter(s => {
      const matchesUniversity = s.universityId === universityId;
      const matchesCareer = (s.careerId === careerId || s.isCrossDisciplinary);
      return matchesUniversity && matchesCareer && this.isEmptyOrContainsSelectedOption(s, careerOptionId);
    })
    .map(element => {
      const node = this.generateNode(element, student);
      edges = this.getEdges(element, edges);
      return node;
    });

    return this.dataset = of({ nodes: new DataSet(nodes), edges: new DataSet(edges) });
  }

  isEmptyOrContainsSelectedOption(subject, selectedOption) {
    return subject.careerOptions ? subject.careerOptions.find(o => o === selectedOption) : true;
  }

  generateNode(subject, student) {
    return {
      id: subject.$key,
      label: subject.name,
      level: subject.quarter,
      group: student['$key'] ? this.getSubjectState(subject, student) : subject.year,
    };
  }

  getSubjectState(subject: Subject, student: Student) {
    let group = 'notAvailable';
    const subjectKey = subject.$key;

    const correlatives = subject.correlatives || { approved: [], regularized: [] };
    const approved = correlatives['approved'] || [];
    const regularized = correlatives['regularized'] || [];
    const realRegularized = _.difference(regularized, approved);

    const studentApproved = student['approved'] || [];
    const studentRegularized = student['regularized'] || [];
    const studentInProgress = student['inProgress'] || [];

    const isApproved = _.includes(studentApproved, subjectKey);
    const isRegularized = _.includes(studentRegularized, subjectKey);
    const isInProgress = _.includes(studentInProgress, subjectKey);
    const isAvailable = approved.every((key) => _.includes(studentApproved, key));

    if (isApproved) {
      group = 'approved';
    } else if (isRegularized) {
      group = 'regularized';
    } else if (isInProgress) {
      group = 'inProgress';
    } else if (isAvailable) {
      group = 'available';
    }
    return group;
  }

  getEdges(subject, edges) {
    const correlatives = subject.correlatives || { approved: [], regularized: [] };
    const approved = correlatives['approved'] || [];
    const regularized = correlatives['regularized'] || [];
    const realRegularized = _.difference(regularized, approved);

    approved.forEach(i => {
      edges.push({
        from: i,
        to: subject.$key,
        title: 'Se necesita tener aprobada \'' + this.getSubjectName(i) + '\'.'
      });
    });

    realRegularized.forEach(i => {
      edges.push({
        from: i,
        to: subject.$key,
        title: 'Se necesita tener regularizada \'' + this.getSubjectName(i) + '\'.',
        dashes: [10, 10]
      });
    });

    return edges;
  }

  getSubjectName(subjectKey) {
    return this.subjects.find(s => s.$key === subjectKey).name;
  }

  getDefaultOptions() {
    const config = {
      locale: 'es',
      nodes: {
        shape: 'dot',
        borderWidth: 3,
        chosen: {
          node: function (values, id, selected, hovering) {
            values.color = '#D2E5FF';
            values.borderColor = '#2B7CE9';
            values.shadowColor = '#D2E5FF';
          }
        },
        font: {
          size: 16,
          strokeWidth: 3
        },
        widthConstraint: {
          minimum: 200,
          maximum: 250
        },
         shapeProperties: {
          interpolation: false
        }
      },
      edges: {
        color: {
          inherit: 'from'
        },
        arrows: 'to',
        width: 2,
        chosen: {
          edge: function (values, id, selected, hovering) {
            values.inheritsColor = 'both';
            values.width = 6;
          }
        }
      },
      groups: {
        approved: {
          color: {
            background: 'lime',
            border: 'green'
          },
        },
        regularized: {
          color: {
            background: 'yellowgreen',
            border: 'green'
          },
        },
        inProgress: {
          color: {
            background: 'yellow',
            border: 'orange'
          }
        },
        available: {
          color: {
            background: 'deepskyblue',
            border: 'dodgerblue'
          }
        },
        notAvailable: {
          color: {
            background: 'LightGray ',
            border: 'gray'
          },
        }
      },
      layout: {
        improvedLayout: false,
        hierarchical: {
          enabled: true,
          direction: 'LR',
          levelSeparation: 250,
          treeSpacing: 1,
        }
      },
      physics: {
        hierarchicalRepulsion: {
          centralGravity: 0.5,
          springLength: 100,
          springConstant: 0.01,
          nodeDistance: 120,
          damping: 0.09
        },
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: {
            enabled: true,
            iterations: 2000,
            updateInterval: 25
        }
      },
      interaction: {
        tooltipDelay: 10,
        navigationButtons: true,
      },
      manipulation: {
        addNode: false,
        editNode: (data, callback) => {
          const modalRef = this.modalService.open(FormModalComponent);
          modalRef.componentInstance.id = data.id;
          modalRef.componentInstance.name = data.label;
          modalRef.componentInstance.state = data.group;

          modalRef.result.then((result) => {
            this.studentService.updateStudentsSubjectState(this.student, result.id, result.state);
            callback(data);
          }).catch((error) => {
            console.log(error);
          });
        },
        deleteNode: false,
        addEdge: false,
        editEdge: false,
        deleteEdge: false
      }
    };
    return config;
  }
}
