import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DomainService } from '../../shared/services/domain.service';
import { DivisionService } from '../../shared/services/division.service';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTooltipModule, RouterModule],
  templateUrl: './domain-list.html',
  styleUrl: './domain-list.css',
})
export class DomainList {
  private domainService = inject(DomainService);
  private divisionService = inject(DivisionService);

  domains = this.domainService.getDomains();
  divisions = this.divisionService.getDivisions();

  filterText = signal('');
  selectedDivision = signal('all');
  selectedSubDivision = signal('all');

  subDivisions = computed(() => {
    if (this.selectedDivision() === 'all') {
      return [];
    }
    const selectedDivision = this.divisions().find(d => d.division === this.selectedDivision());
    return selectedDivision ? selectedDivision['sub-divisions'] : [];
  });

  filteredDomains = computed(() => {
    let filtered = this.domains();

    if (this.filterText()) {
      filtered = filtered.filter(domain =>
        domain.name.toLowerCase().includes(this.filterText().toLowerCase())
      );
    }

    if (this.selectedDivision() !== 'all') {
      filtered = filtered.filter(domain => domain.division === this.selectedDivision());
    }

    if (this.selectedSubDivision() !== 'all') {
      filtered = filtered.filter(domain => domain['sub-division'] === this.selectedSubDivision());
    }

    return filtered;
  });

  onDivisionChange(division: string): void {
    this.selectedDivision.set(division);
    this.selectedSubDivision.set('all');
  }
}
