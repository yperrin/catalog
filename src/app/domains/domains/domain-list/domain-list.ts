import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DomainService } from '../../../shared/services/domain.service';
import { Domain } from '../../../shared/models/domain.model';
import { DivisionService, Division } from '../../../shared/services/division.service';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './domain-list.html',
  styleUrl: './domain-list.css',
})
export class DomainList implements OnInit {
  domains: Domain[] = [];
  filterText = '';
  private domainService = inject(DomainService);
  private divisionService = inject(DivisionService);

  divisions: Division[] = [];
  subDivisions: string[] = [];

  selectedDivision = 'all';
  selectedSubDivision = 'all';

  ngOnInit(): void {
    this.domainService.getDomains().subscribe(domains => {
      this.domains = domains;
    });
    this.divisionService.getDivisions().subscribe(data => {
      this.divisions = data;
    });
  }

  onDivisionChange(): void {
    this.selectedSubDivision = 'all';
    if (this.selectedDivision === 'all') {
      this.subDivisions = [];
    } else {
      const selectedDivision = this.divisions.find(d => d.division === this.selectedDivision);
      this.subDivisions = selectedDivision ? selectedDivision['sub-divisions'] : [];
    }
  }

  get filteredDomains(): Domain[] {
    let filtered = this.domains;

    if (this.filterText) {
      filtered = filtered.filter(domain =>
        domain.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    if (this.selectedDivision !== 'all') {
      filtered = filtered.filter(domain => domain.division === this.selectedDivision);
    }

    if (this.selectedSubDivision !== 'all') {
      filtered = filtered.filter(domain => domain['sub-division'] === this.selectedSubDivision);
    }

    return filtered;
  }
}
