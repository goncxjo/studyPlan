import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

import { NgProgress } from 'ngx-progressbar';

import { NetworkService } from '../../services/network.service';
import { StudentService } from '../../services/student.service';
import { Network } from 'vis';
import { Student } from '../../models/student';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  public student: Student;
  public network?: Network;
  public options;
  public data;
  public container;
  public subscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    private networkService: NetworkService, 
    private studentService: StudentService,
    public ngProgress: NgProgress, 
  ) {
  }

  ngOnInit() {
    this.startLoading();
    this.container = document.getElementById('mynetwork');
    this.options = this.networkService.getOptions();
    const id = this.route.snapshot.paramMap.get('$key');
    this.studentService.getStudentById(id).pipe(
      tap(student => {
        student.$key = id;
        this.student = student;
        this.subscription = this.generateNetwork();
      })
    ).subscribe(() => this.completeLoading());
  }
  
  generateNetwork() {
    return this.networkService.getCourses(this.student).subscribe(dataset => {
      this.data = dataset;
      this.network = new Network(this.container, this.data, this.options);
    });
  }
  
  draw() {
    this.startLoading();
    destroy(this.network);
    this.generateNetwork();

    function destroy(network) {
      this.subscription.unsubscribe();
      if (network) {
        network.destroy();
        network = null;
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}
