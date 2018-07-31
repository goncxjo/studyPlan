import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { SubjectService } from './subject.service';
import { DataSet } from 'vis';
import { Student } from '../models/student';
import { Observable } from 'rxjs';
import { tap, map, flatMap } from 'rxjs/operators';
import { Subject } from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  dataset: any;
  subjects: Subject[];

  constructor(private subjectService: SubjectService) {}

  getCourses(student: Student) {
    return this.dataset = this.subjectService.getSubjectsByCareer(student.careerId).pipe(
      map(subjects => {
        let edges = [];
        const nodes = subjects.map(element => {
          const node = {
            id: element.$key,
            label: element.name,
            level: (element.quarter - 1),
            rel: element.correlatives,
            group: 'noDisponible',
            orientations: element.careerOptions
          };
          if (element.correlatives) {
            element.correlatives['approved'].forEach(i => {
              edges.push({
                from: i,
                to: element.$key,
                chosen: {
                  label: false
                }
              });
            });
          }
          return node;
        });
        return {
          nodes: new DataSet(nodes),
          edges: new DataSet(edges),
        };
      })    );
  }

  getOptions() {
    let config = {
      locale: 'es',
      nodes: {
        shape: 'dot',
        borderWidth: 3,
        borderWidthSelected: 4,
        chosen: {
          node: function (values, id, selected, hovering) {
            values.color = '#D2E5FF';
            values.borderColor = '#2B7CE9';
            values.shadowColor = '#D2E5FF';
            values.shadowSize = 75;
          }
        },
        shadow: true,
        font: {
          face: 'verdana',
          size: 16,
          strokeWidth: 3
        },
        widthConstraint: {
          minimum: 150,
          maximum: 150
        },
        heightConstraint: {
          minimum: 50,
        },
        scaling: {
          min: 10,
          max: 30,
          label: {
            min: 8,
            max: 30,
            drawThreshold: 12,
            maxVisible: 20
          }
        },
      },
      edges: {
        color: {
          inherit: 'from'
        },
        arrows: 'to',
        width: 2,
        shadow: true,
        smooth: {
          type: 'vertical',
          roundness: 0
        },
        chosen: {
          edge: function (values, id, selected, hovering) {
            values.inheritsColor = "both";
            values.width = 6;
          }
        }
      },
      groups: {
        aprobada: {
          color: {
            background: 'lime',
            border: 'green'
          },
        },
        cursando: {
          color: {
            background: 'yellow',
            border: 'orange'
          }
        },
        disponible: {
          color: {
            background: 'deepskyblue',
            border: 'dodgerblue'
          }
        },
        noDisponible: {
          color: {
            background: 'LightGray ',
            border: 'gray'
          },
        },
        label: {
          shape: 'box',
          color: {
            background: 'white ',
            border: 'gray'
          },
        }
      },
      layout: {
        hierarchical: {
          enabled: true,
          sortMethod: 'directed',
          direction: 'UD',
          levelSeparation: 200,
          nodeSpacing: 100,
          treeSpacing: 10,
          blockShifting: false,
          edgeMinimization: true
        }
      },
      physics: {
        hierarchicalRepulsion: {
          nodeDistance: 200
        }
      },
      interaction: {
        tooltipDelay: 200,
        hover: true,
        navigationButtons: true,
      }
    };

    return config;
  }
}
