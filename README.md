
# Codely N-Tiers Architecture
![enter image description here](https://raw.githubusercontent.com/Mostafa-Elmoghazi/codely-nestjs/main/Codely%20NestJS%20Architecture.png)
## Entities Layer

 - This is where we define the data model classes. This layer is
   accessible by the Business, Data, and API layers.
 - In this layer, we define the data models, Data Transformation objects
   (DTOs), enums, and the events.

## Data Layer

 - This is where we define data access related stuff. This where the
   repository pattern is implemented. We have 2 base repositories.
   - **PGBaseRepository**: It defines the base CRUD operations using TypeORM. Any repository that would connect to a Postgres database should inherit from this base repository.
   - **BaseMongoRepository**: It defines base CRUD operations using Mongoose. Any repository that would connect to a MongoDB should inherit from this base repository.
In the Data layer, we also define the data migrations.
## Business Layer
- This is where we define the main application logic. In this layer, we use the CQRS pattern for segregating read and write operations. Each component has its own folder, under which, we define commands and queries in 2 separate folders. 
	- For handling any events, we define the event handlers in the event-hanlders folder.
	- Exceptions folder contains any user-defined exceptions.
## Core Layer
- In the core layer, we define general purpose stuff that is shared for any other layer in the project.
	- Examples of general purpose services: 
		- **S3Service**, the service that is responsible for communication with AWS S3 to create or delete buckets and upload or download files.
		- **CacheService**: this service is responsible for creating cache keys and storing/retrieving objects in/from the cache.
		- **MailerService**: this is responsible for sending emails from the system. It could be used by any other layer to send email messages.
		- **ApiService**: this service could be used by proxy classes defined into the business layer to make HTTP requests to external systems. 
## API Layer
- This is where we defines the controllers. The API layer depends on the Business layer to call the commands and queries defined for handling application logic.
