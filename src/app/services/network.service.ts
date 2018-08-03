import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { SubjectService } from './subject.service';
import { DataSet } from 'vis';
import { map } from 'rxjs/operators';
import { Subject } from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  dataset: any;
  subjects: Subject[];

  constructor(private subjectService: SubjectService) {}

  getCourses(studentId, careerId, careerOptionId) {
    return this.dataset = this.subjectService.getSubjects().pipe(
      map(subjects => {
        let edges = [];
        const nodes = subjects
        .filter(s => (s.careerId || '').includes(careerId) && (s.careerOptionId ? s.careerOptionId.includes(careerOptionId) : true))
        .map(element => {
          const node = {
            id: element.$key,
            label: element.name,
            level: element.quarter,
            group: studentId ? 0 : element.year,
          };
          if (element.correlatives) {
            (element.correlatives['approved'] || []).forEach(i => {
              edges.push({
                from: i,
                to: element.$key
              });
            });
          }
          if (element.correlatives) {
            (element.correlatives['regularized'] || []).forEach(i => {
              edges.push({
                from: i,
                to: element.$key,
                chosen: { label: false },
                dashes: [10, 10]
              });
            });
          }
          return node;
        });
        return {
          nodes: new DataSet(nodes),
          edges: new DataSet(edges),
        };
      }));
  }

  getOptions() {
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
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },

      },
      interaction: {
        tooltipDelay: 200,
        navigationButtons: true,
      }
    };

    return config;
  }
}
