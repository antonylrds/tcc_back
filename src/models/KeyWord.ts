import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Paper from './Paper';

@Entity('key_words')
class KeyWord {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  word: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Paper)
  @JoinTable({
    name: 'key_word_paper',
    joinColumn: {
      name: 'word_id',
      referencedColumnName: 'id',
    },
  })
  papers: Paper[];
}

export default KeyWord;
