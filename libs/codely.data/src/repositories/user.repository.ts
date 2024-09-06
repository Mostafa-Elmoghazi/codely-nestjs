import { Injectable } from '@nestjs/common';
import { User } from 'codely/codely.entities/data-models';
import { PGBaseRepository } from './base/base-pg.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends PGBaseRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
  async findByEmail(email: string): Promise<User | null> {
    return (await this.repository.findOneBy({ email })) || null;
  }
  
  async findBySocialIdAndProvider(socialId: string, provider: string): Promise<User | null> {
    return (await this.repository.findOneBy({ socialId, provider })) || null;
  }
}
