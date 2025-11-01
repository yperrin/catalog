import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  services$: Observable<Service[]> = this.servicesSubject.asObservable();
  private services: Service[] = [];

  constructor() {
    this.loadServices();
  }

  private loadServices(): void {
    this.http.get<Service[]>('assets/services.json').pipe(
      take(1),
      tap(data => {
        this.services = data;
        this.servicesSubject.next(this.services);
      }),
      catchError(error => {
        console.error('Error loading services:', error);
        this.services = [];
        this.servicesSubject.next(this.services);
        return of([]);
      })
    ).subscribe();
  }

  getServices(): Observable<Service[]> {
    return this.services$;
  }
}
