import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Fee { 
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    fast: number;

    @Column()
    normal: number;

    @Column()
    slow: number;

    @Column()
    timestamp: string;

    @Column('double')
    unixTimeStamp: number;
}