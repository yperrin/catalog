import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Service } from '../models/service.model';
import { SelectedService } from '../../services/service-view/selected-service';
import { DomainClient } from './domain-client';
import { DomainDataFlow } from '../models/domain';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceClient {
  private http = inject(HttpClient);
  private domainClient = inject(DomainClient);

  private servicesSignal = signal<Service[]>([]);
  public services: Signal<Service[]> = this.servicesSignal.asReadonly();
  private selectedServiceSignal = signal<SelectedService>(null);
  public selectedService: Signal<SelectedService | null> =
    this.selectedServiceSignal.asReadonly();
  private loadingSignal = signal<boolean>(false);
  public loading: Signal<boolean> = this.loadingSignal.asReadonly();

  constructor() {
    this.loadServices();
  }

  private loadServices(): void {
    this.http
      .get<Service[]>('assets/services.json')
      .pipe(
        tap((data) => {
          this.servicesSignal.set(data);
        }),
        catchError((error) => {
          console.error('Error loading services:', error);
          this.servicesSignal.set([]);
          return of([]);
        })
      )
      .subscribe();
  }

  selectServiceByName(name: string): void {
    this.loadingSignal.set(true);
    const service = this.servicesSignal().find((s) => s.name === name) || null;
    if (service) {
      const selectedService: SelectedService = {
        name: service.name,
        description: service.description,
        domains: [],
      };
      const domains = this.domainClient.getDomains()();
      const arrayOfMatchingDataFlows = domains.filter((domain) => domain.dataFlowFile).map((domain) => {
        const dataFlow = domain.dataFlowFile;
        return this.http.get('assets/' + dataFlow).pipe(
          map((data: DomainDataFlow) => {
            const serviceNode = data.nodes.find((n) => n.id === service.name);
            if (serviceNode) {
              return {
                domain: domain.name,
                description: domain.description,
                modifies: serviceNode.modifies,
                aliases: serviceNode.aliases,
              };
            }
          })
        );
      });
      combineLatest(arrayOfMatchingDataFlows)
        .pipe(
          map((results) => results.filter((result) => result !== undefined)),
          tap((domains) => {
            domains.forEach((d) => {
              selectedService.domains.push({
                name: d.domain,
                description: d.description,
                dataUpdated: d.modifies,
                aliases: d.aliases,
              });
            });
            this.selectedServiceSignal.set(selectedService);
            this.loadingSignal.set(false);
          }),
          catchError((error) => {
            console.error('Error loading domain data:', error);
            this.selectedServiceSignal.set(selectedService);
            this.loadingSignal.set(false);
            return of([]);
          })
        )
        .subscribe();
    } else {
      this.selectedServiceSignal.set(null);
    }
  }
}
