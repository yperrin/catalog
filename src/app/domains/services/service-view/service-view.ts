import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Domain } from '../../../domains/shared/models/domain.model';
import { ServiceService } from '../../../domains/shared/services/service.service';

@Component({
  selector: 'app-service-view',
  imports: [RouterLink],
  templateUrl: './service-view.html',
  styleUrl: './service-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceView {
  private readonly route = inject(ActivatedRoute);
  private readonly serviceService = inject(ServiceService);

  readonly loading = this.serviceService.loading;
  readonly service = this.serviceService.selectedService;

  trackByDomainName(index: number, domain: Domain): string {
    return domain.name;
  }

  constructor() {
    const serviceName = this.route.snapshot.paramMap.get('name');
    this.service = this.serviceService.selectedService;
    this.serviceService.selectServiceByName(serviceName);
  }
}
