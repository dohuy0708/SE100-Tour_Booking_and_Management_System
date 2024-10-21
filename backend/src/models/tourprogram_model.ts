import { injectable } from 'inversify';    // Dependency Injection nếu bạn dùng inversify
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Group } from './group_model';
import { Tour } from './tour_model';

@injectable()  // Sử dụng DI của inversify nếu bạn dùng DI
@Entity()      // Đánh dấu class này là một entity trong TypeORM
export class TourProgram {
  @PrimaryGeneratedColumn('uuid')  // Tự động tạo cột ID kiểu UUID
  schedule_id!: string;

  @OneToMany(()=>Tour, (tour)=>tour.tour_id, {onDelete:'CASCADE'}) 
  tour_id!: Tour;

  @Column('int')  
  day_number!: string;

  @Column('text')  
  schedule_description!: string;

}
