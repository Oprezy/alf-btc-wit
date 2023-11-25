import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exchange } from './exchange.entity';

@Entity()
export class Hash {
    @Column() 
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true })
    hash: string;
    
    @Column('double', { nullable: false })
    saved: number;
    
    @Column({ nullable: false })
    savedLiteral: string;

    @ManyToOne(() => Exchange)
    exchange: Exchange;
}