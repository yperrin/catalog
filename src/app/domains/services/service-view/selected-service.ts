export interface SelectedService { 
  name: string;
  description: string;
  domains: ServiceDomain[];
}

export interface ServiceDomain {
  name: string;
  description: string;
  dataUpdated: boolean;
  aliases?: string[];  // Service-specific names for this domain
}