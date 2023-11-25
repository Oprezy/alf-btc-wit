import {
  Column,
  Entity, 
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exchange } from './exchange.entity';

@Entity()
export class Address {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column({ unique: true })
  address: string;

  @Column({ default: null })
  alias: string;

  @ManyToOne(() => Exchange, (exchange) => exchange.addresses)
  @JoinColumn()
  exchange: Exchange;
}
