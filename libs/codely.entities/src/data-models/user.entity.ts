import { Exclude, Expose } from 'class-transformer';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    firstName: string;

    @Column({ type: 'varchar', length: 100 })
    lastName: string;

    @Column({ type: 'varchar', length: 250, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    deviceId: string;

    @Expose({ groups: ['me', 'admin'] })
    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar', length: 300, nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    emailVerificationToken: string;

    @Expose({ groups: ['me', 'admin'] })
    @Column({ type: 'boolean', nullable: true })
    isEmailVerified: boolean;

    @Expose({ groups: ['me', 'admin'] })
    @Column({ type: 'varchar', length: 50, nullable: true })
    phoneVerificationCode: string;

    @Expose({ groups: ['me', 'admin'] })
    @Column({ type: 'boolean', nullable: true })
    isPhoneVerified: boolean;

    @Column({ type: 'smallint', nullable: true })
    countryId: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string;

    @Expose({ groups: ['me', 'admin'] })
    @Column({ type: 'varchar', length: 100, nullable: true })
    socialId: string;

    @Expose({ groups: ['me', 'admin'] })
    @Column({ type: 'varchar', nullable: true })
    provider: string;

    @Column({ type: 'varchar', length: 250, nullable: true })
    photoUrl: string;

    @Column({ type: 'smallint', nullable: true })
    availabilityStatusId: number;

    @Column({ type: 'smallint', nullable: true })
    statusId: number;

    @Column({ type: 'varchar', length: 300, nullable: true })
    bio: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
