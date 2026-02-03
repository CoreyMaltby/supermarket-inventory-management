Supermarket Inventory Manager (PoC)
This is a full-stack reactive inventory management system built with React and Supabase. This project demonstrates real-time data updating, relational database design, and analytics.
Features
•	Real-Time Synch: Utilises PostgreSQL replication via Supabase Realtime to update the UI instantly across all clients without the page refreshing.
•	Multi-view Navigation: Full CRUD operations, inline editing, and simple live inventory analytics. (total value, out of stock, and low stock alerts).
•	Customer Storefront: Interactive ordering system that handles stock deductions and availability checks
•	Restock Portal: Admin interface for inventory ordering
•	Supplier Directory: Relational view mapping many-to-many relationships between vendors and catalogue items .
•	Relational Database Design: Products mapped to multiple suppliers via a junction table
•	Configured Row-Level Security policies to manage anonymous data access

Tech Stack
•	Frontend: React, Vite
•	Backend/Database: Supabase
•	State Management: React Hooks
•	API/Realtime: Supabase JS Client 

Database Schema
To replicate this database, run the following in your Superbase SQL Editor:

create table public.categories (
  id serial not null,
  name text not null,
  constraint categories_pkey primary key (id),
  constraint categories_name_key unique (name)
) TABLESPACE pg_default;


create table public.products (
  id serial not null,
  name text not null,
  category_id integer null,
  price numeric(10, 2) null default 0.00,
  quantity integer null default 0,
  constraint products_pkey primary key (id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null
) TABLESPACE pg_default;

create table public.products (
  id serial not null,
  name text not null,
  category_id integer null,
  price numeric(10, 2) null default 0.00,
  quantity integer null default 0,
  constraint products_pkey primary key (id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null
) TABLESPACE pg_default;

create table public.product_suppliers (
  product_id integer not null,
  supplier_id integer not null,
  constraint product_suppliers_pkey primary key (product_id, supplier_id),
  constraint product_suppliers_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint product_suppliers_supplier_id_fkey foreign KEY (supplier_id) references suppliers (id) on delete CASCADE
) TABLESPACE pg_default;