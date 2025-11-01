import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomainService } from '../../../shared/services/domain.service';
import { Domain } from '../../../shared/models/domain.model';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domain-list.html',
  styleUrl: './domain-list.css',
})
export class DomainList implements OnInit {
  domains: Domain[] = [];
  filterText = '';
  private domainService = inject(DomainService);

  ngOnInit(): void {
    this.domainService.getDomains().subscribe(domains => {
      this.domains = domains;
    });
  }

  get filteredDomains(): Domain[] {
    if (!this.filterText) {
      return this.domains;
    }
    return this.domains.filter(domain =>
      domain.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

}
