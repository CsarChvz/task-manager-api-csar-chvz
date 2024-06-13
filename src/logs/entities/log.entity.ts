import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from "typeorm";

@Entity()
@Index("idx_log_entity_type", ["entity_type"]) // Índice en el tipo de entidad
@Index("idx_log_action_type", ["action_type"]) // Índice en el tipo de acción
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    entity_type: string;  // Tipo de entidad, por ejemplo, 'Task', 'Comment'

    @Column()
    entity_id: number;  // ID de la entidad afectada

    @Column({ length: 50 })
    action_type: string;  // Tipo de acción, por ejemplo, 'CREATE', 'UPDATE', 'DELETE'

    @Column("text", { nullable: true })
    changes: string;  // Detalles de los cambios realizados (opcional)

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(() => User, user => user.logs)
    user: User;

    @ManyToOne(() => Task, task => task.logs)
    task: Task;
}
