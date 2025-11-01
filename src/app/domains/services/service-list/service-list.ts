import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceService } from '../../../shared/services/service.service';
import { Service } from '../../../shared/models/service.model';
import { HttpClient } from '@angular/common/http';

interface Division {
  division: string;
  'sub-divisions': string[];
}

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatTooltipModule],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList implements OnInit {
  services: Service[] = [];
  filterText = '';
  private serviceService = inject(ServiceService);
  private http = inject(HttpClient);

  divisions: Division[] = [];
  subDivisions: string[] = [];

  selectedDivision = 'all';
  selectedSubDivision = 'all';

  ngOnInit(): void {
    this.serviceService.getServices().subscribe(services => {
      this.services = services;
    });
    this.http.get<Division[]>('/assets/divisions.json').subscribe(data => {
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

  get filteredServices(): Service[] {
    let filtered = this.services;

    if (this.filterText) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    if (this.selectedDivision !== 'all') {
      filtered = filtered.filter(service => service.division === this.selectedDivision);
    }

    if (this.selectedSubDivision !== 'all') {
      filtered = filtered.filter(service => service['sub-division'] === this.selectedSubDivision);
    }

    return filtered;
  }
}
