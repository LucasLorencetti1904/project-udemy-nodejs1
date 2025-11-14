import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("user_tokens")
export default class UserToken implements UserTokenModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    @Generated("uuid")
    token: string;

    @Column("uuid")
    userId: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}