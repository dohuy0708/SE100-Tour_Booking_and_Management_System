import { injectable } from 'inversify';    // Dependency Injection nếu bạn dùng inversify
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Group } from './group_model';
import { Tour } from './tour_model';
import { BaseModel } from './base-model';

@injectable()  // Sử dụng DI của inversify nếu bạn dùng DI
@Entity()      // Đánh dấu class này là một entity trong TypeORM
export class TourMedia extends BaseModel{
  @PrimaryGeneratedColumn('uuid')  // Tự động tạo cột ID kiểu UUID
  media_id!: string;

  @Column('varchar', { length: 255 })  
  cover_image!: string;

  @Column('varchar', { length: 255 })  
  image_1!: string;

  @Column('varchar', { length: 255 })  
  image_2!: string;

  @Column('varchar', { length: 255 })  
  image_3!: string;

  @Column('varchar', { length: 255 })  
  image_4!: string;

  @Column('varchar', { length: 255 })  
  image_5!: string;

  @Column('varchar', { length: 255 })  
  image_6!: string;

  @ManyToOne(()=>Tour, (tour)=>tour.media, {onDelete:'CASCADE'})
  tour_id!:Tour;

}