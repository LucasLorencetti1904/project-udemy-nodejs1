import { MigrationInterface, QueryRunner, Table } from "typeorm";
import commonFields from "@/common/infrastructure/typeorm/migrations/commonFields";

export class CreateUsers1762263461611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    ...commonFields,
                    {
                        name: "name",
                        type: "varchar"
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
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("users");
    }

}
