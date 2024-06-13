import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @ManyToMany(() => Task, task => task.tags)
    tasks: Task[];
}
