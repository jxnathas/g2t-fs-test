import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1749143532632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('admin123', 10);
    await queryRunner.query(`
      INSERT INTO "user" ("name", "email", "password", "role")
      VALUES ('Admin', 'admin@example.com', '${password}', 'admin')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user" WHERE "email" = 'admin@example.com'`,
    );
  }
}