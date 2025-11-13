# Data Model: View Service Page

## Entities

### Service
- **Name**: String (Unique Identifier)
- **Description**: String

### Domain
- **Name**: String (Unique Identifier)
- **Link to Domain Flow**: String (URL or route path)

### ServiceDomainRelationship
- **Service Name**: String (Foreign Key to Service.Name)
- **Domain Name**: String (Foreign Key to Domain.Name)
- **DataModificationStatus**: Boolean (Indicates if the service modifies the data for the domain)
