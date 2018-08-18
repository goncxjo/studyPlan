import { Component, Input, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Network } from 'vis';

import { NetworkService } from '../../services/network.service';
import { Student } from '../../models/student/student';
import { Subject } from '../../models/subject/subject';
import * as d3 from 'd3';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements AfterViewInit {
  @Input() student: Student;
  @Input() subjects: Subject[];
  simulation: any;
  dataset: any;

  @ViewChild('container') container: ElementRef;

  constructor(private networkService: NetworkService) { }

  ngAfterViewInit() {
    this.generateGraph();
  }

  generateGraph() {
    this.networkService.set(this.student, this.subjects);
    this.dataset = this.networkService.getDataSet();

    const width = 900, height = 400, radius = 10;
    const fill = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('svg')
      .attr('width',  width)
      .attr('height', height);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function(d) { return d.id; }))
      // .force('charge', d3.forceManyBody())
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-200).distanceMin(10000))
      .force('collide', d3.forceCollide(25));

    simulation.force('xAxis', d3.forceX(function(d) {
      return d.quarter * 100;
    }).strength(5));
    simulation.force('yAxis', d3.forceY(height / 2).strength(0.05));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.dataset.links)
      .enter().append('line');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.dataset.nodes)
      .enter().append('circle')
      .attr('r', radius)
      .attr('fill', function(d) { return fill(d.group); })
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

    node.append('title')
      .text(function(d) { return d.name; });

    simulation
      .nodes(this.dataset.nodes)
      .on('tick', ticked);

    simulation.force('link')
      .distance(function(d) {
        return Math.exp(d.distance) || 100;
      })
      .strength(0.005)
      .links(this.dataset.links);

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    function ticked() {
      link
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      node
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['student'] && !changes['student'].isFirstChange()) || (changes['subjects'] && !changes['subjects'].isFirstChange())) {
      // this.regenerateNetwork();
      this.generateGraph();
    }
  }
}
