import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Network } from 'vis';

import { NetworkService } from '../../services/network.service';
import { Student } from '../../models/student/student';
import { Subject } from '../../models/subject/subject';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  @Input() student: Student;
  @Input() subjects: Subject[];

  public network?: Network;
  public options: any;
  public data: any;
  public container: HTMLElement;

  constructor(private networkService: NetworkService) { }

  ngOnInit() {
    this.container = document.getElementById('mynetwork');
    this.options = this.networkService.getDefaultOptions();
    this.networkService.init(this.student, this.subjects);
    this.data = this.networkService.getDataSet();
    this.network = new Network(this.container, this.data, this.options);
  }

  regenerateNetwork() {
    destroy(this.network, this.data);
    this.data = this.networkService.getDataSet();
    this.network = new Network(this.container, this.data, this.options);
    
    function destroy(network, data) {
      if (network) {
        network.destroy();
        network = null;
        data = null;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student'] && !changes['student'].isFirstChange()) {
      this.regenerateNetwork();
    } else if (changes['careerOption'] && !changes['careerOption'].isFirstChange()) {
      this.regenerateNetwork();
    }
  }
}
