import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1710789008978 implements MigrationInterface {
  name = 'Migrations1710789008978'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "appeal" ("id" SERIAL NOT NULL, "title" character varying, "slug" text NOT NULL, "thumbnailUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f644a99d2dfcff9facb08bd1697" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news_translation" ("id" SERIAL NOT NULL, "language" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "newsId" uuid, CONSTRAINT "PK_7c332d415ea0fafe4cdb4de581a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "publishDate" TIMESTAMP, "published" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "news_translation" ADD CONSTRAINT "FK_03a6155d79d5ea69f5114bf271a" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`
    INSERT INTO "news" ("title", "description", "publishDate", "published")
    VALUES
        ('Новина 1', 'Опис новини 1', 'now()', true),
        ('Новина 2', 'Опис новини 2', 'now()', false),
        ('Новина 3', 'Опис новини 3', 'now()', true),
        ('Новина 4', 'Опис новини 4', 'now()', true),
        ('Новина 5', 'Опис новини 5', 'now()', false),
        ('Новина 6', 'Опис новини 6', 'now()', true)
`)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news_translation" DROP CONSTRAINT "FK_03a6155d79d5ea69f5114bf271a"`)
    await queryRunner.query(`DROP TABLE "news"`)
    await queryRunner.query(`DROP TABLE "news_translation"`)
    await queryRunner.query(`DROP TABLE "appeal"`)
  }
}
