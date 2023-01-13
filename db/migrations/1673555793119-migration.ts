import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673555793119 implements MigrationInterface {
    name = 'migration1673555793119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "balance" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE ("name"), CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('PROFITABLE', 'CONSUMABLE')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionId" character varying NOT NULL, "amount" integer NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bankId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d8686d6790ecde6318e48232d06" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d8686d6790ecde6318e48232d06"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "bank"`);
    }

}
