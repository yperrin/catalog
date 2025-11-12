import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Domain, formatDomainWithAliases } from '../../shared/models/domain';
import { ServiceClient } from '../../../domains/shared/services/service-client';
import { ServiceDomain } from './selected-service';

@Component({
  selector: 'app-service-view',
  imports: [RouterLink],
  templateUrl: './service-view.html',
  styleUrl: './service-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceView {
  private readonly route = inject(ActivatedRoute);
  private readonly serviceClient = inject(ServiceClient);

  readonly loading = this.serviceClient.loading;
  readonly service = this.serviceClient.selectedService;

  trackByDomainName(index: number, domain: Domain): string {
    return domain.name;
  }

  formatDomainDisplay(domain: ServiceDomain): string {
    return formatDomainWithAliases(domain.name, domain.aliases);
  }

  constructor() {
    const serviceName = this.route.snapshot.paramMap.get('name');
    this.service = this.serviceClient.selectedService;
    this.serviceClient.selectServiceByName(serviceName);
  }
}
