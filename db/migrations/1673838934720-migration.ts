import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673838934720 implements MigrationInterface {
    name = 'migration1673838934720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('PROFITABLE', 'CONSUMABLE')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionId" character varying NOT NULL, "amount" integer NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "category" text array NOT NULL DEFAULT '{}', "bankId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "balance" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE ("name"), CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_categories_category" ("transactionId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_0d8a5d83b9b2fa5fd69e2f49e2a" PRIMARY KEY ("transactionId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f122af6428c36e90cc79141e52" ON "transaction_categories_category" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d308518c7d704c7ed5dd6c153" ON "transaction_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d8686d6790ecde6318e48232d06" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_categories_category" ADD CONSTRAINT "FK_f122af6428c36e90cc79141e523" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_categories_category" ADD CONSTRAINT "FK_3d308518c7d704c7ed5dd6c1538" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_categories_category" DROP CONSTRAINT "FK_3d308518c7d704c7ed5dd6c1538"`);
        await queryRunner.query(`ALTER TABLE "transaction_categories_category" DROP CONSTRAINT "FK_f122af6428c36e90cc79141e523"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d8686d6790ecde6318e48232d06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d308518c7d704c7ed5dd6c153"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f122af6428c36e90cc79141e52"`);
        await queryRunner.query(`DROP TABLE "transaction_categories_category"`);
        await queryRunner.query(`DROP TABLE "bank"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
