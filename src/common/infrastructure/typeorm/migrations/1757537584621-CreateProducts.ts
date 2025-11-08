import { MigrationInterface, QueryRunner, Table } from "typeorm";
import commonFields from "@/common/infrastructure/typeorm/migrations/commonFields";

export class CreateProducts1757537584621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    ...commonFields,
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "quantity",
                        type: "int"
                    },  
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }
}