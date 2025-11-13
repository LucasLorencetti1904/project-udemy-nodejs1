import { ForeignKey, MigrationInterface, QueryRunner, Table } from "typeorm";
import commonFields from "./commonFields";

export class CreateUserTokens1763066651782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.createTable(
            new Table({
                name: "user_tokens",
                columns: [
                    ...commonFields,
                    {
                        name: "token",
                        type: "uuid",
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: "varchar"
                    },
                    {
                        name: "avatar",
                        type: "varchar",
                        isNullable: true
                    },
                ],
                foreignKeys: [
                    {
                        name: "TokenUser",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_tokens");
    }

}
