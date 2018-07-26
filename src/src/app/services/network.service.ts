import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import * as _ from 'lodash';
import { DataSet } from 'vis';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private firebase: AngularFireDatabase) { }
  /*
    getCourses(selected) {
      let courses = _.filter(jsonContent, function (item) {
        return (item.Orientacion.length == 0 || _.includes(item.Orientacion, selected.orientation));
      });
      let length = 0;
      let nodesDataset = [],
        edgesDataset = [];
  
      _.forEach(courses, function (element) {
        nodesDataset.push({
          id: element.Id,
          label: element.Nombre,
          level: (element.Cuatrimestre - 1),
          rel: element.Correlativas,
          group: element.Grupo,
          orientation: element.Orientacion
        });
        if (element.Correlativas != undefined) {
          length = element.Correlativas.length;
          for (let i = 0, c = element.Correlativas; i < length; i++) {
            edgesDataset.push({
              from: c[i],
              to: element.Id,
              chosen: {
                label: false
              }
            });
          }
        }
      });
  
      let dataset = {
        nodes: new DataSet(nodesDataset),
        edges: new DataSet(edgesDataset)
      }
  
      return dataset;
    }
  */
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
