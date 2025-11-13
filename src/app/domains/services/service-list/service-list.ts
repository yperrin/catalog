import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServiceClient } from '../../shared/services/service-client';
import { DivisionClient } from '../../shared/services/division-client';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, RouterModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList {
  private serviceClient = inject(ServiceClient);
  private divisionClient = inject(DivisionClient);

  services = this.serviceClient.services;
  divisions = this.divisionClient.getDivisions();

  filterText = signal('');
  selectedDivision = signal('all');
  selectedSubDivision = signal('all');
  contentFilter = signal<'all' | 'content' | 'non-content'>('all');

  subDivisions = computed(() => {
    if (this.selectedDivision() === 'all') {
      return [];
    }
    const selectedDivision = this.divisions().find(d => d.division === this.selectedDivision());
    return selectedDivision ? selectedDivision['sub-divisions'] : [];
  });

  filteredServices = computed(() => {
    let filtered = this.services();

    if (this.filterText()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(this.filterText().toLowerCase())
      );
    }

    if (this.selectedDivision() !== 'all') {
      filtered = filtered.filter(service => service.division === this.selectedDivision());
    }

    if (this.selectedSubDivision() !== 'all') {
      filtered = filtered.filter(service => service['sub-division'] === this.selectedSubDivision());
    }

    if (this.contentFilter() === 'content') {
      filtered = filtered.filter(service => service.content);
    } else if (this.contentFilter() === 'non-content') {
      filtered = filtered.filter(service => !service.content);
    }

    return filtered;
  });

  onDivisionChange(division: string): void {
    this.selectedDivision.set(division);
    this.selectedSubDivision.set('all');
  }
}
