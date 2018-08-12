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

  @ViewChild('container') container: ElementRef;

  public network?: Network;
  public options: any;
  public data: any;
  private isDrawing: Boolean = false;

  constructor(private networkService: NetworkService) { }

  ngAfterViewInit() {
    this.options = this.networkService.getDefaultOptions();
    this.initNetwork();
  }

  initNetwork() {
    this.isDrawing = true;

    this.networkService.set(this.student, this.subjects);
    this.data = this.networkService.getDataSet();
    this.network = new Network(this.container.nativeElement, this.data, this.options);
    this.handleNetworkStabilization();
  }

  handleNetworkStabilization() {
    const loadingBar = document.getElementById('loadingBar');
    const bar = document.getElementById('bar');

    bar.style.width = '0%';
    loadingBar.style.opacity = '1';
    loadingBar.style.display = 'block';

    this.network.on('stabilizationProgress', function(params) {
      const maxWidth = 496;
      const minWidth = 20;
      const widthFactor = params.iterations/params.total;
      const width = Math.max(minWidth,maxWidth * widthFactor);

      const bar = document.getElementById('bar');
      bar.style.width = width + '%';
    });
    this.network.once('stabilizationIterationsDone', function() {
      const bar = document.getElementById('bar');
      const loadingBar = document.getElementById('loadingBar');
      
      bar.style.width = '496px';
      loadingBar.style.opacity = '0';
      // really clean the dom element
      setTimeout(() => {
        const loadingBar = document.getElementById('loadingBar');
        loadingBar.style.display = 'none';
      }, 500);
    });
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
