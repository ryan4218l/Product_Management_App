import { Migration } from '@mikro-orm/migrations';

export class Migration20250902142523 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" serial primary key, "name" varchar(255) not null, "description" text null, "price" numeric(10,2) not null, "stock" int not null default 0, "image_url" varchar(255) null, "category" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "role" varchar(255) not null default 'customer', "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "order" ("id" serial primary key, "user_id" int not null, "total_amount" numeric(10,2) not null, "status" varchar(255) not null default 'pending', "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "order_item" ("id" serial primary key, "order_id" int not null, "product_id" int not null, "quantity" int not null, "price" numeric(10,2) not null, "created_at" timestamptz not null);`);

    this.addSql(`alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`insert into "user" ("email", "password", "role", "created_at", "updated_at") values ('admin@gmail.com', '$2a$12$4JSXpEBS5q9KH5H5ZH7SN.pL/E7Go0LJWR7ngBouMZoP68DP/y1lm', 'admin', now(), now()), ('customer@gmail.com', '$2b$12$HPwsi/qJo7N7gXj6jOPgDO7sA.sZYhh8YSkKzXNf.yUWoFlqYjfWa', 'customer', now(), now());`);

    this.addSql(`insert into "product" ("name", "description", "price", "stock", "image_url", "category", "created_at", "updated_at") values ('Panda Plush Toy', 'A soft and cuddly plush toy modeled after the Giant Pandas at the Singapore Zoo.', 24.90, 150, 'https://m.media-amazon.com/images/I/71x0VBEGSyL.jpg', 'Toy', now(), now()), ('Orangutan Keychain', 'A durable metal keychain featuring a playful orangutan design.', 8.50, 300, 'https://cdn11.bigcommerce.com/s-qnjeuni46r/images/stencil/2048x2048/products/13010/49535/SN_Orangutan_Keychain__51673.1678273119.jpg?c=2', 'Apparel & Accessory', now(), now()), ('Night Safari T-Shirt', 'Black t-shirt with a glow-in-the-dark animal print from the Night Safari.', 29.99, 120, 'https://i.etsystatic.com/14310196/r/il/17cfdf/6416106476/il_fullxfull.6416106476_b46g.jpg', 'Apparel & Accessory', now(), now()), ('Rhino Figurine', 'A realistic, hand-painted figurine of a rhinoceros from the Wild Africa exhibit.', 19.95, 8, 'https://cdn.playtherapysupply.com/img/f/e69f78397599.jpg', 'Animal Figurine', now(), now()), ('Rainforest Lumina Magnet', 'A souvenir magnet from the Rainforest Lumina show, featuring a vibrant light trail design.', 6.00, 400, 'https://cdn02.pinkoi.com/product/kvzxfrSA/0/1/640x530.jpg', 'Decoration', now(), now()), ('Lion Cub Stuffed Animal', 'A miniature plush lion cub, soft and safe for all ages.', 22.00, 130, 'https://m.media-amazon.com/images/I/81yyC7lTDZL.jpg', 'Toy', now(), now()), ('Elephant Figurine', 'A small, detailed statue of an Asian elephant, hand-carved from sustainable wood.', 16.99, 80, 'https://i.ebayimg.com/images/g/U3YAAOSwBIBj48tM/s-l1200.jpg', 'Decoration', now(), now());`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order_item" drop constraint "order_item_product_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_user_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "order" cascade;`);

    this.addSql(`drop table if exists "order_item" cascade;`);
  }

}
