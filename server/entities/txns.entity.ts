import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { Address } from './address.entity';

@Entity()
export class Txn {
    @Column() 
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    hash: string;

    @Column()
    address: string;

    @Column({ default: null })
    alias: string;
    
    @Column()
    time: string;
     
    @Column()
    unixTimestamp: number;

    @Column({
        type: 'enum',
        enum: ['input', 'output']
    })
    type: string;
    
    @Column('double')
    amount: number;
    
    @Column()
    confirmations: number;

    @Column({ unique: true })
    unique: string;
}