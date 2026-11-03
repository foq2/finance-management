import { Migration } from '@mikro-orm/migrations';

export class Migration20261103041727_init_finance_service_db extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "categories"
       (
         "id"         uuid         not null,
         "created_at" timestamptz  not null default now(),
         "updated_at" timestamptz  not null default now(),
         "deleted_at" timestamptz null,
         "user_id"    varchar(255) not null,
         "name"       varchar(255) not null,
         "parent_id"  uuid null,
         primary key ("id")
       );`,
    );

    this.addSql(
      `create table "accounts"
       (
         "id"          uuid         not null,
         "created_at"  timestamptz  not null default now(),
         "updated_at"  timestamptz  not null default now(),
         "deleted_at"  timestamptz null,
         "user_id"     varchar(255) not null,
         "name"        varchar(255) not null,
         "type"        varchar(255) not null,
         "description" varchar(255) null,
         "category_id" uuid         not null,
         primary key ("id")
       );`,
    );

    this.addSql(
      `create table "transactions"
       (
         "id"          uuid         not null,
         "created_at"  timestamptz  not null default now(),
         "updated_at"  timestamptz  not null default now(),
         "deleted_at"  timestamptz null,
         "user_id"     varchar(255) not null,
         "date"        timestamptz  not null,
         "description" varchar(255) not null,
         "reference"   varchar(255) null,
         primary key ("id")
       );`,
    );

    this.addSql(
      `create table "transaction_entries"
       (
         "id"             uuid           not null,
         "created_at"     timestamptz    not null default now(),
         "updated_at"     timestamptz    not null default now(),
         "deleted_at"     timestamptz null,
         "transaction_id" uuid           not null,
         "account_id"     uuid           not null,
         "type"           varchar(255)   not null,
         "amount"         numeric(18, 4) not null,
         "description"    varchar(255) null,
         primary key ("id")
       );`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "categories" cascade;`);
    this.addSql(`drop table if exists "accounts" cascade;`);
    this.addSql(`drop table if exists "transactions" cascade;`);
    this.addSql(`drop table if exists "transaction_entries" cascade;`);
  }
}
