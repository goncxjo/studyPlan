import { Component, OnInit} from '@angular/core';
import { NetworkService } from '../../services/network.service'
import { Network, DataSet } from 'vis';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  private service;
  public network ? : Network;
  public options;
  public data;
  public container;
  public selected = {
    university: "UNDAV",
    career: "ING-INF",
    orientation: "SD",
  }

  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    /*
      this.options = this.networkService.getOptions();
      // this.data = this.networkService.getCourses(this.selected);
      this.data = {
        nodes: new DataSet([
          {id: 1, label: 'Node 1'},
          {id: 2, label: 'Node 2'},
          {id: 3, label: 'Node 3'},
          {id: 4, label: 'Node 4'},
          {id: 5, label: 'Node 5'}
        ]),
        edges: new DataSet([
          {from: 1, to: 3},
          {from: 1, to: 2},
          {from: 2, to: 4},
          {from: 2, to: 5},
          {from: 3, to: 3}
        ])
      }
      this.container = document.getElementById('mynetwork');
      this.network = new Network(this.container, this.data, this.options);
      */
  }

  draw() {
    destroy(this.network);
    this.data = this.service.getCourses(this.selected);
    this.network = new Network(this.container, this.data, this.options);

    function destroy(network) {
      if (network !== null) {
        network.destroy();
        network = null;
      }
    }
  }

}
