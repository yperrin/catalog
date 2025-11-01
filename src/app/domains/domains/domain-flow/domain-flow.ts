import { Component, inject, signal, computed, effect, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainService } from '../../shared/services/domain.service';
import { DataFlowService, DataFlow } from '../../shared/services/data-flow.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-domain-flow',
  standalone: true,
  imports: [],
  templateUrl: './domain-flow.html',
  styleUrl: './domain-flow.css',
})
export class DomainFlow {
  private route = inject(ActivatedRoute);
  private domainService = inject(DomainService);
  private dataFlowService = inject(DataFlowService);

  @ViewChild('diagramContainer', { static: true }) private diagramContainer!: ElementRef;

  private domainName = signal<string | null>(null);
  domain = computed(() => {
    const domains = this.domainService.getDomains()();
    const domainName = this.domainName();
    if (domains && domainName) {
      return domains.find(d => d.name === domainName);
    }
    return undefined;
  });

  dataFlow = signal<DataFlow | undefined>(undefined);

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.domainName.set(params.get('name'));
    });

    effect(() => {
      const currentDomain = this.domain();
      if (currentDomain && currentDomain.dataFlowFile) {
        this.dataFlowService.getDataFlow(currentDomain.dataFlowFile).subscribe(data => {
          this.dataFlow.set(data);
        });
      }
    });

    effect(() => {
      const data = this.dataFlow();
      if (data) {
        this.renderDiagram(data);
      }
    });
  }

  private renderDiagram(data: DataFlow): void {
    const width = 800;
    const height = 600;

    const svg = d3.select(this.diagramContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.edges)
      .join('line')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => {
        if (data.initialization.services.includes(d.id)) {
          return '#008000'; // Green for initial nodes
        } else if (d.modifies) {
          return '#ff7f0e'; // Orange for modifies nodes
        } else {
          return '#1f77b4'; // Blue for other nodes
        }
      })
      .call(this.drag(simulation) as any);

    const text = svg.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text((d: any) => d.id)
      .attr('x', -25)
      .attr('y', 30);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      text
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
  }

  private drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
}
