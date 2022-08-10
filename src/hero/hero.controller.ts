import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc, GrpcMethod, RpcException } from '@nestjs/microservices';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { Hero } from './interfaces/hero.interface';
import { HeroById } from './interfaces/hero-by-id.interface';

interface HeroService {
  findOne(data: HeroById): Observable<Hero>;

  findMany(upstream: Observable<HeroById>): Observable<Hero>;
}

@Controller('hero')
export class HeroController implements OnModuleInit {
  private heroService: HeroService;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>('HeroService');
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<void> {
    try {
      await lastValueFrom(this.heroService.findOne({ id: +id }));
    } catch (err) {
      console.log(err);
    }
  }

  @GrpcMethod('HeroService')
  findOne(data: HeroById): Observable<Hero> {
    const notFoundException = new RpcException({
      code: 5,
      message: 'Hero not found',
    });
    return throwError(() => notFoundException);
  }
}
