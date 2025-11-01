import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private servicesSignal = signal<Service[]>([]);
  public services: Signal<Service[]> = this.servicesSignal.asReadonly();

  constructor() {
    this.loadServices();
  }

  private loadServices(): void {
    this.http.get<Service[]>('assets/services.json').pipe(
      tap(data => {
        this.servicesSignal.set(data);
      }),
      catchError(error => {
        console.error('Error loading services:', error);
        this.servicesSignal.set([]);
        return of([]);
      })
    ).subscribe();
  }

  getServices(): Signal<Service[]> {
    return this.services;
  }
}
