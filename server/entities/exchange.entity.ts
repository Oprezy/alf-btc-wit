import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class Exchange {
    @Column() 
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true })
    name: string;
    
    @Column({ unique: true })
    url: string;

    @Column({ unique: true })
    address: string;
    
    @OneToMany(() => Address, (address) => address.exchange)
    addresses: Address[]
}