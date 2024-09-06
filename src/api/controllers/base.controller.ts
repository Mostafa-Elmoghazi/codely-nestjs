import { ApiSecurity } from "@nestjs/swagger";

@ApiSecurity('language')
export class BaseController {}
