import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from '@modules/queue/queue.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), QueueModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
