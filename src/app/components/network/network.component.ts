import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { NetworkService } from '../../services/network.service';
import { Network } from 'vis';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  @Input() student: string;
  @Input() career: string;
  @Input() careerOption: string;

  public network?: Network;
  public options: any;
  public data: any;
  public container: HTMLElement;
  public subscription: Subscription;

  constructor(
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    this.container = document.getElementById('mynetwork');
    this.options = this.networkService.getOptions();
    this.generateNetwork(this.student, this.career, this.careerOption);
  }
  
  generateNetwork(student, career, option) {
    console.log(student, career, option);
    return this.networkService.getCourses(student, career, option).subscribe(dataset => {
      this.data = dataset;
      this.network = new Network(this.container, this.data, this.options);
    });
  }
  
  draw() {
    destroy(this.network);
    this.generateNetwork(this.student, this.career, this.careerOption);

    function destroy(network) {
      if (network) {
        network.destroy();
        network = null;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.student, this.career, this.careerOption);
    if (changes['careerOption'] && !changes['careerOption'].isFirstChange()) {
      this.draw();
    }
  }
}
