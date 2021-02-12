import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateTableKeyWordPaper1613091861638
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'key_word_paper',
        columns: [
          {
            name: 'paper_id',
            type: 'uuid',
          },
          {
            name: 'word_id',
            type: 'integer',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'key_word_paper',
      new TableForeignKey({
        name: 'fk_paper_key_word',
        columnNames: ['paper_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'papers',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'key_word_paper',
      new TableForeignKey({
        name: 'fk_key_word_paper',
        columnNames: ['word_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'key_words',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('key_word_paper', 'fk_key_word_paper');
    await queryRunner.dropForeignKey('key_word_paper', 'fk_paper_key_word');
    await queryRunner.dropTable('key_word_paper');
  }
}
