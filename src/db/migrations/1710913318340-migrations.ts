import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1710913318340 implements MigrationInterface {
  name = 'Migrations1710913318340'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "news_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "newsId" uuid, CONSTRAINT "PK_7c332d415ea0fafe4cdb4de581a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "publishDate" TIMESTAMP, "language" character varying NOT NULL DEFAULT 'uk', "published" boolean NOT NULL DEFAULT false, "categoryId" uuid NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL DEFAULT 'uk', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aac53a9364896452e463139e4a0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "category_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "categoryId" uuid, CONSTRAINT "PK_eeafea0891382f348c30a2a6bc2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "appeal" ("id" SERIAL NOT NULL, "title" character varying, "slug" text NOT NULL, "thumbnailUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f644a99d2dfcff9facb08bd1697" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "news_translation" ADD CONSTRAINT "FK_03a6155d79d5ea69f5114bf271a" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "category_translation" ADD CONSTRAINT "FK_63e1ac2bf59c85a5d5a5322c637" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category_translation" DROP CONSTRAINT "FK_63e1ac2bf59c85a5d5a5322c637"`)
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01"`)
    await queryRunner.query(`ALTER TABLE "news_translation" DROP CONSTRAINT "FK_03a6155d79d5ea69f5114bf271a"`)
    await queryRunner.query(`DROP TABLE "appeal"`)
    await queryRunner.query(`DROP TABLE "category_translation"`)
    await queryRunner.query(`DROP TABLE "news_category"`)
    await queryRunner.query(`DROP TABLE "news"`)
    await queryRunner.query(`DROP TABLE "news_translation"`)
  }
}
