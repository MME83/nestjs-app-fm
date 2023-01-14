import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673716547620 implements MigrationInterface {
    name = 'migration1673716547620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "category" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "category"`);
    }

}
