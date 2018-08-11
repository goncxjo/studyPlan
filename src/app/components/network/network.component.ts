import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Network } from 'vis';

import { NetworkService } from '../../services/network.service';
import { Student } from '../../models/student/student';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  @Input() student: Student;
  @Input() university: string;
  @Input() career: string;
  @Input() careerOption: string;

  public network?: Network;
  public options: any;
  public data: any;
  public container: HTMLElement;

  constructor(private networkService: NetworkService) { }

  ngOnInit() {
    this.container = document.getElementById('mynetwork');
    this.options = this.networkService.getDefaultOptions();
    this.generateNetwork(this.student, this.university, this.career, this.careerOption);
  }

  generateNetwork(student, university, career, option) {
    return this.networkService.generateDataSet(student, university, career, option).subscribe(dataset => {
      this.data = dataset;
      this.network = new Network(this.container, this.data, this.options);
    });
  }

  regenerateNetwork() {
    destroy(this.network);

    this.networkService.getDataSet(this.student, this.university, this.career, this.careerOption).subscribe(dataset => {
      this.data = dataset;
      this.network = new Network(this.container, this.data, this.options);
    });

    function destroy(network) {
      if (network) {
        network.destroy();
        network = null;
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
