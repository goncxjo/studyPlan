import { Component, Input, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Network } from 'vis';

import { NetworkService } from '../../services/network.service';
import { Student } from '../../models/student/student';
import { Subject } from '../../models/subject/subject';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements AfterViewInit {
  @Input() student: Student;
  @Input() subjects: Subject[];

  @ViewChild('container')
    container: ElementRef;

  public network?: Network;
  public options: any;
  public data: any;

  constructor(private networkService: NetworkService) { }

  ngAfterViewInit() {
    this.options = this.networkService.getDefaultOptions();
    this.initNetwork();
  }

  initNetwork() {
    this.networkService.set(this.student, this.subjects);
    this.data = this.networkService.getDataSet();
    this.network = new Network(this.container.nativeElement, this.data, this.options);
  }

  regenerateNetwork() {
    destroy(this.network);
    this.initNetwork();

    function destroy(network) {
      if (network) {
        network.destroy();
        network = null;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['student'] && !changes['student'].isFirstChange()) || (changes['subjects'] && !changes['subjects'].isFirstChange())) {
      this.regenerateNetwork();
    }
  }
}
