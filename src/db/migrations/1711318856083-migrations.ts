import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1711318856083 implements MigrationInterface {
  name = 'Migrations1711318856083'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "news_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lang" character varying NOT NULL, "title" character varying, "description" character varying, "thumbnailUrl" character varying, "htmlText" text, "metaTitle" character varying, "metaDescription" character varying, "metaKeywords" text, "ogTitle" character varying, "ogDescription" character varying, "ogImage" character varying, "newsId" uuid, CONSTRAINT "PK_7c332d415ea0fafe4cdb4de581a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isPublished" boolean NOT NULL DEFAULT false, "slug" character varying NOT NULL, "thumbnailUrl" character varying NOT NULL, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "newsCategoryId" uuid, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news_category_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lang" character varying NOT NULL, "title" character varying, "categoryId" uuid, CONSTRAINT "PK_04add7dee88ce1084a008c683fb" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "publishedAt" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, CONSTRAINT "PK_aac53a9364896452e463139e4a0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`CREATE TYPE "public"."appeal_type_enum" AS ENUM('join', 'revalidation')`)
    await queryRunner.query(
      `CREATE TABLE "appeal" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "finishedAt" TIMESTAMP NOT NULL, "type" "public"."appeal_type_enum" NOT NULL, "ipn" bigint NOT NULL, "age" integer NOT NULL, CONSTRAINT "PK_f644a99d2dfcff9facb08bd1697" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "title" character varying, "slug" text NOT NULL, "thumbnailUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "news_translation" ADD CONSTRAINT "FK_03a6155d79d5ea69f5114bf271a" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_6573fe000551c966d07f27513c0" FOREIGN KEY ("newsCategoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "news_category_translation" ADD CONSTRAINT "FK_a1e3edb3b4a8043170b56a50558" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news_category_translation" DROP CONSTRAINT "FK_a1e3edb3b4a8043170b56a50558"`)
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_6573fe000551c966d07f27513c0"`)
    await queryRunner.query(`ALTER TABLE "news_translation" DROP CONSTRAINT "FK_03a6155d79d5ea69f5114bf271a"`)
    await queryRunner.query(`DROP TABLE "project"`)
    await queryRunner.query(`DROP TABLE "appeal"`)
    await queryRunner.query(`DROP TYPE "public"."appeal_type_enum"`)
    await queryRunner.query(`DROP TABLE "news_category"`)
    await queryRunner.query(`DROP TABLE "news_category_translation"`)
    await queryRunner.query(`DROP TABLE "news"`)
    await queryRunner.query(`DROP TABLE "news_translation"`)
  }
}
