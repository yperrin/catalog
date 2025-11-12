import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DomainClient } from '../../shared/services/domain-client';
import { DivisionClient } from '../../shared/services/division-client';
import { DomainWithAliases, Domain } from '../../shared/models/domain';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTooltipModule, RouterModule],
  templateUrl: './domain-list.html',
  styleUrl: './domain-list.css',
})
export class DomainList {
  private domainClient = inject(DomainClient);
  private divisionClient = inject(DivisionClient);

  domains = this.domainClient.getDomains();
  domainsWithAliases = signal<DomainWithAliases[]>([]);
  divisions = this.divisionClient.getDivisions();

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
    let filtered = this.domainsWithAliases();

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

  constructor() {
    // Load domains with aliases when domains change
    effect(() => {
      const domains = this.domains();
      if (domains.length > 0) {
        this.loadDomainsWithAliases(domains);
      }
    });
  }

  private loadDomainsWithAliases(domains: Domain[]): void {
    const domainWithAliases$ = domains.map(domain =>
      this.domainClient.getDomainWithAliases(domain.name)
    );
    
    combineLatest(domainWithAliases$).subscribe(domainsWithAliases => {
      this.domainsWithAliases.set(
        domainsWithAliases.filter(d => d !== undefined) as DomainWithAliases[]
      );
    });
  }

  getAliasCount(domain: DomainWithAliases): number {
    return domain.aliases?.length ?? 0;
  }

  getAliasText(domain: DomainWithAliases): string {
    const count = this.getAliasCount(domain);
    if (count === 0) return 'No service-specific names';
    if (count === 1) return '1 service-specific name';
    return `${count} service-specific names`;
  }

  onDivisionChange(division: string): void {
    this.selectedDivision.set(division);
    this.selectedSubDivision.set('all');
  }
}
