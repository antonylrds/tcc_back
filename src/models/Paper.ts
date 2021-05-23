import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import User from './User';
import KeyWord from './KeyWord';

@Entity('papers')
class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  author: string;

  @Column()
  professor: string;

  @Column('timestamp without time zone', { name: 'publication_dt' })
  publicationDate: Date;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  abstract: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: User;

  @Column()
  path: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @ManyToMany(() => KeyWord)
  @JoinTable({
    name: 'key_word_paper',
    joinColumn: { name: 'paper_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'word_id',
      referencedColumnName: 'id',
    },
  })
  keyWords: KeyWord[];
}

export default Paper;
