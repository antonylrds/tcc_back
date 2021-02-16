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

  @Column('timestamp without time zone')
  publication_date: Date;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => KeyWord)
  @JoinTable({
    name: 'key_word_paper',
    joinColumn: { name: 'paper_id', referencedColumnName: 'id' },
  })
  keyWords: KeyWord[];
}

export default Paper;
