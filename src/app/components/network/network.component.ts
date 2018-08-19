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

    console.log(this.dataset);

    const numberOfQuarters = this.dataset.numberOfQuarters;
    const maxNodesQuarter = this.dataset.maxNodesQuarter;

    console.log(numberOfQuarters);
    console.log(maxNodesQuarter);

    const margin = {top: 50, right: 50, bottom: 50, left: 50},
          width = 1000 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
    const radius = 15;
    const fill = d3.scaleOrdinal(d3.schemeSet2);

    const x = d3.scaleLinear()
      .domain( [1, numberOfQuarters] )
      .range( [margin.left, width + margin.right ] );

    const y = d3.scaleLinear()
      .domain( [0, maxNodesQuarter] )
      .range( [margin.top + height, margin.bottom ] );

    const xAxis = d3.axisBottom(x).ticks(numberOfQuarters);

    const svg = d3.select('#container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('shape-rendering', 'geometric-precision');

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${margin.top + height})`)
      .call(xAxis);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function(d) { return d.id; }))
      .force('charge', d3.forceManyBody().strength(-200).distanceMin(50).distanceMax(200))
      .force('collide', d3.forceCollide(25));

    simulation
      .force('x', d3.forceX((d) => x(d.xPos)).strength(5))
      .force('y', d3.forceY((d) => {
        const partitions = numberOfQuarters / d.nodesPerQuarter;
        return y(partitions + d.yPos);
      }).strength(5));

    // add defs-markers
    svg.append('svg:defs').selectAll('marker')
      .data([{ id: 'end-arrow', opacity: 1 }, { id: 'end-arrow-fade', opacity: 0.1 }])
      .enter().append('marker')
      .attr('id', d => d.id)
      .attr('viewBox', '0 0 10 10')
      .attr('refX', radius + 8)
      .attr('refY', radius / 3)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,0 L0,10 L10,5 z')
      .style('opacity', d => d.opacity);

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.dataset.links)
      .enter().append('line');

    link
      .attr('marker-end', 'url(#end-arrow)')
      .on('mouseout', fade(1));

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.dataset.nodes)
      .enter().append('g');

    const circles = node.append('circle')
      .attr('r', radius)
      .attr('fill', function(d) { return fill(d.group); })
      .attr('cx', function(d) { return d.quarter; } )
      .on('mouseover', fade(0.1))
      .on('mouseout', fade(1))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      ;

    const labels = node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dx', 0)
      .attr('dy', radius * 2)
      .attr('font-size', '8px')
      .text((d) => d.name)
      .call(getTextBox);

    node.insert('rect', 'text')
      .attr('x', (d) => d.bbox.x)
      .attr('y', (d) => d.bbox.y)
      .attr('width', (d) => d.bbox.width)
      .attr('height', (d) => d.bbox.height)
      .attr('fill', 'white');

    function getTextBox(selection) {
      selection.each(function(d) { d.bbox = this.getBBox(); });
    }

    // node.append('title')
    //   .text((d) => d.id);

    simulation
      .nodes(this.dataset.nodes)
      .on('tick', ticked);

    simulation.force('link')
      .strength(0)
      .links(this.dataset.links);

    function ticked() {
      link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

      node
        .attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

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

    const linkedByIndex = {};
    this.dataset.links.forEach(d => {
      linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
    });

    function isConnected(a, b) {
      return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }

    function fade(opacity) {
      return d => {
        node.style('stroke-opacity', function (o) {
          const thisOpacity = isConnected(d, o) ? 1 : opacity;
          this.setAttribute('fill-opacity', thisOpacity);
          return thisOpacity;
        });

        link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
        link.attr('marker-end', o => (opacity === 1 || o.source === d || o.target === d ? 'url(#end-arrow)' : 'url(#end-arrow-fade)'));
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['student'] && !changes['student'].isFirstChange()) || (changes['subjects'] && !changes['subjects'].isFirstChange())) {
      d3.select('svg').remove();
      this.generateGraph();
    }
  }
}
