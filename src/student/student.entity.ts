import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dob: Date;

  @Column()
  gender: string;

  @Column()
  email: string;

  @Column()
  country: string;
}