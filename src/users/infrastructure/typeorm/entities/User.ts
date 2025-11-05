import UserModel from "@/users/domain/models/UserModel";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export default class User implements UserModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    name: string;

    @Column("varchar")
    email: string;

    @Column("varchar")
    password: string;

    @Column("varchar", { nullable: true })
    avatar?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}