import { Column, MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddPathColumToPapersTAble1613947435188
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'papers',
      new TableColumn({
        name: 'path',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('papers', 'path');
  }
}
