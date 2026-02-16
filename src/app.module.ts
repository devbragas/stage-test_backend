import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AreasModule } from './modules/areas/areas.module';
import { ProcessesModule } from './modules/processes/processes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AreasModule,
    ProcessesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
