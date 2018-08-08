import { Injectable } from '@angular/core';

import { DataSet } from 'vis';
import * as _ from 'lodash';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { SubjectService } from './subject.service';
import { Subject } from '../models/subject/subject';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  dataset: Observable<{ nodes: DataSet, edges: DataSet }>;
  subjects: Subject[];

  constructor(private subjectService: SubjectService) {
    this.subjectService.getSubjects().subscribe(ss => this.subjects = ss);
  }

  generateDataSet(studentId, universityId, careerId, careerOptionId) {
    return this.dataset = this.subjectService.getSubjects().pipe(
      tap(subjects => this.subjects = subjects),
      map(subjects => {
        let edges = [];
        const nodes = subjects
          .filter(s => {
            const matchesUniversity = s.universityId === universityId;
            const matchesCareer = (s.careerId === careerId || s.isCrossDisciplinary);
            return matchesUniversity && matchesCareer && this.isEmptyOrContainsSelectedOption(s, careerOptionId);
          })
          .map(element => {
            const node = this.generateNode(element, studentId);
            edges = this.getEdges(element, edges);
            return node;
          });
        return {
          nodes: new DataSet(nodes),
          edges: new DataSet(edges),
        };
      }));
  }

  getDataSet(studentId, universityId, careerId, careerOptionId) {
    let edges = [];
    const nodes = (this.subjects || [])
    .filter(s => {
      const matchesUniversity = s.universityId === universityId;
      const matchesCareer = (s.careerId === careerId || s.isCrossDisciplinary);
      return matchesUniversity && matchesCareer && this.isEmptyOrContainsSelectedOption(s, careerOptionId);
    })
    .map(element => {
      const node = this.generateNode(element, studentId);
      edges = this.getEdges(element, edges);
      return node;
    });

    return this.dataset = of({ nodes: new DataSet(nodes), edges: new DataSet(edges) });
  }

  isEmptyOrContainsSelectedOption(subject, selectedOption) {
    return subject.careerOptions ? subject.careerOptions.find(o => o === selectedOption) : true;
  }

  generateNode(subject, studentId) {
    return {
      id: subject.$key,
      label: subject.name,
      level: subject.quarter,
      group: studentId ? 0 : subject.year,
    };
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
        title: 'Se necesita tener aprobada \"' + this.getSubjectName(i) + '\".'
      });
    });

    realRegularized.forEach(i => {
      edges.push({
        from: i,
        to: subject.$key,
        title: 'Se necesita tener regularizada \"' + this.getSubjectName(i) + '\".',
        dashes: [10, 10]
      });
    });

    return edges;
  }

  getSubjectName(subjectKey) {
    return this.subjects.find(s => s.$key === subjectKey).name;
  }

  getDefaultOptions() {
    let config = {
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
      }
    };
    return config;
  }
}
