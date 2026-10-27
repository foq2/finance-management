import { Migration } from '@mikro-orm/migrations';

export class Migration20261022105835_create_table_users extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "name" varchar(255) not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, primary key ("id"));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
