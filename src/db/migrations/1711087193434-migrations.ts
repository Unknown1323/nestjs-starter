import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1711087193434 implements MigrationInterface {
  name = 'Migrations1711087193434'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "appeal" ("id" SERIAL NOT NULL, "title" character varying, "slug" text NOT NULL, "thumbnailUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f644a99d2dfcff9facb08bd1697" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lang" character varying NOT NULL, "title" character varying, "description" character varying, "thumbnailUrl" character varying, "newsId" uuid, "categoryId" uuid, CONSTRAINT "PK_7aef875e43ab80d34a0cdd39c70" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "publishedAt" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, CONSTRAINT "PK_aac53a9364896452e463139e4a0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "publishedAt" boolean NOT NULL DEFAULT false, "slug" character varying NOT NULL, "newsCategoryId" uuid, "thumbnailUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "translation" ADD CONSTRAINT "FK_4216885b35568e87961c841250f" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "translation" ADD CONSTRAINT "FK_95df471b0467fcc77cae707db00" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_6573fe000551c966d07f27513c0" FOREIGN KEY ("newsCategoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_6573fe000551c966d07f27513c0"`)
    await queryRunner.query(`ALTER TABLE "translation" DROP CONSTRAINT "FK_95df471b0467fcc77cae707db00"`)
    await queryRunner.query(`ALTER TABLE "translation" DROP CONSTRAINT "FK_4216885b35568e87961c841250f"`)
    await queryRunner.query(`DROP TABLE "news"`)
    await queryRunner.query(`DROP TABLE "news_category"`)
    await queryRunner.query(`DROP TABLE "translation"`)
    await queryRunner.query(`DROP TABLE "appeal"`)
  }
}
