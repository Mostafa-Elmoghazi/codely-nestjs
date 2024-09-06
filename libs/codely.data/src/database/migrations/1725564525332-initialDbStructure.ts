import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDbStructure1725564525332 implements MigrationInterface {
    name = 'InitialDbStructure1725564525332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(250), "phoneNumber" character varying(20), "deviceId" character varying(100), "password" character varying(300), "emailVerificationToken" character varying(100), "isEmailVerified" boolean, "phoneVerificationCode" character varying(50), "isPhoneVerified" boolean, "countryId" smallint, "city" character varying(100), "socialId" character varying(100), "provider" character varying, "photoUrl" character varying(250), "availabilityStatusId" smallint, "statusId" smallint, "bio" character varying(300), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
