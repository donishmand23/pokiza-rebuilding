-- DATABASE CONFIGURATION
\c postgres;
drop database if exists pokiza;
create database pokiza;
\c pokiza;

create extension "pgcrypto";

-- 03. branches
drop table if exists branches cascade;
create table branches (
	branch_id bigserial not null primary key,
	branch_name character varying(128),
	branch_created_at timestamptz default current_timestamp,
	branch_deleted_at timestamptz default null
);


-- ADDRESSES MODULE
-- 04. states
drop table if exists states cascade;
create table states (
	state_id bigserial not null primary key,
	state_name character varying(64),
	state_created_at timestamptz default current_timestamp,
	state_deleted_at timestamptz default null
);

-- 05. regions
drop table if exists regions cascade;
create table regions (
	region_id bigserial not null primary key,
	region_name character varying(64),
	state_id bigint not null references states (state_id),
	branch_id bigint not null references branches (branch_id),
	region_created_at timestamptz default current_timestamp,
	region_deleted_at timestamptz default null
);

-- 06. neighborhoods
drop table if exists neighborhoods cascade;
create table neighborhoods (
	neighborhood_id bigserial not null primary key,
	neighborhood_name character varying(70),
	neighborhood_distance numeric,
	region_id bigint not null references regions (region_id),
	neighborhood_created_at timestamptz default current_timestamp,
	neighborhood_deleted_at timestamptz default null
);

-- 07. streets
drop table if exists streets cascade;
create table streets (
	street_id bigserial not null primary key,
	street_name character varying(70),
	street_distance numeric,
	street_created_at timestamptz default current_timestamp,
	street_deleted_at timestamptz default null
);

-- 08. areas
drop table if exists areas cascade;
create table areas (
	area_id bigserial not null primary key,
	area_name character varying(70),
	area_distance numeric,
	area_created_at timestamptz default current_timestamp,
	area_deleted_at timestamptz default null
);

-- 09. neighborhood-streets ( join table to reference neighborhoods and streets )
drop table if exists neighborhood_streets cascade;
create table neighborhood_streets (
	neighborhood_street_id bigserial not null primary key,
	neighborhood_id bigint not null references neighborhoods(neighborhood_id),
	street_id bigint not null references streets(street_id),
	neighborhood_street_created_at timestamptz default current_timestamp,
	neighborhood_street_deleted_at timestamptz default null
);

-- 10. street-areas ( join table to reference streets and areas )
drop table if exists street_areas cascade;
create table street_areas (
	street_area_id bigserial not null primary key,
	street_id bigint not null references streets(street_id),
	area_id bigint not null references areas(area_id),
	street_area_created_at timestamptz default current_timestamp,
	street_area_deleted_at timestamptz default null
);


-- USER SYSTEM MODULE
-- 11. addresses ( table for storing user and order adresses ) 
drop table if exists addresses cascade;
create table addresses (
	address_id bigserial not null primary key,
	state_id bigint not null references states(state_id),
	region_id bigint not null references regions(region_id),
	neighborhood_id bigint references neighborhoods(neighborhood_id),
	street_id bigint references streets(street_id),
	area_id bigint references areas(area_id),
	address_home_number smallint,
	address_target text,
	address_created_at timestamptz default current_timestamp,
	address_deleted_at timestamptz default null
);

-- analitics
drop table if exists social_sets cascade;
create table social_sets (
	social_set_id serial not null primary key,
	social_set_name character varying(30) not null,
	social_set_icon text not null,
	social_set_created_at timestamptz default current_timestamp
);

-- 12. users ( general info for staffs and clients )
drop table if exists users cascade;
create table users (
	user_id bigserial not null primary key,
	user_main_contact character varying(12),
	user_second_contact character varying(12),
	user_password character varying(60),
	user_first_name character varying(32),
	user_last_name character varying(32),
	user_birth_date date,
	user_gender smallint check (user_gender in (1, 2)),
	branch_id bigint references branches(branch_id),
	address_id bigint references addresses(address_id),
	user_deleted_at timestamptz default null,
	user_created_at timestamptz default current_timestamp,
	unique(user_main_contact)
);

-- 13. staffs
drop table if exists staffs cascade;
create table staffs (
	staff_id bigserial not null primary key,
	staff_img text,
	user_id bigint not null references users (user_id),
	staff_created_at timestamptz default current_timestamp,
	staff_deleted_at timestamptz default null
);

-- 14. clients
drop table if exists clients cascade;
create table clients (
	client_id bigserial not null primary key,
	client_status smallint default 1,
	client_summary character varying(128),
	social_set_id bigint references social_sets(social_set_id),
	user_id bigint not null references users (user_id),
	client_created_at timestamptz default current_timestamp,
	client_deleted_at timestamptz default null
);

-- -- PERMISSIONS MODULE
-- -- 23. permissions ( general permission actions )
-- drop table if exists permissions cascade;
-- create table permissions (
-- 	permission_action int not null primary key unique,
-- 	permission_model character varying(128) not null
-- );

-- -- 24. permission sets ( permissions that each user has )
-- drop table if exists permission_sets cascade;
-- create table permission_sets (
-- 	permission_set_id bigserial not null primary key,
-- 	user_id bigint references users(user_id),
-- 	permission_action int references permissions(permission_action),
-- 	branch_id bigint not null references branches(branch_id),
-- 	permission_set_created_at timestamptz default current_timestamp,
-- 	unique (user_id, permission_action, branch_id)
-- );

-- -- 25. permission groups ( groups for grouping a set of permissions )
-- drop table if exists permission_groups cascade;
-- create table permission_groups (
-- 	group_id bigserial not null primary key,
-- 	group_name character varying(128) not null,
-- 	group_created_at timestamptz default current_timestamp,
-- 	group_deleted_at timestamptz default null
-- );

-- -- 26. permission group sets ( for grouping a set of permissions )
-- drop table if exists permission_group_sets cascade;
-- create table permission_group_sets (
-- 	group_set_id bigserial not null primary key,
-- 	group_id bigint not null references permission_groups(group_id) ON DELETE CASCADE,
-- 	permission_action int not null references permissions(permission_action),
-- 	unique (group_id, permission_action)
-- );

-- -- DATABASE GENERAL INFORMATION
-- -- 01. sms service
-- drop table if exists sms_info cascade;
-- create table sms_info (
-- 	info_id bigserial not null primary key,
-- 	email character varying(128) not null,
-- 	password character varying(128) not null,
-- 	token text not null,
-- 	token_time timestamptz default current_timestamp
-- );

-- -- 02. files
-- drop table if exists files cascade;
-- create table files (
-- 	file_id bigserial not null primary key,
-- 	file_field character varying(64) not null,
-- 	file_path text not null,
-- 	file_field_id bigint not null
-- );



-- -- HISTORY
-- -- 15. history ( store order, product, service, price, client and staff history data )
-- drop table if exists history cascade;
-- create table history (
-- 	history_id bigserial not null primary key,
-- 	history_table_name character varying(25) not null,
-- 	history_row_id bigint not null,
-- 	history_column_name character varying(25) not null,
-- 	history_old_value character varying(35),
-- 	history_new_value character varying(35),
-- 	branch_id bigint not null references branches(branch_id),
-- 	user_id bigint not null references users(user_id),
-- 	history_created_at timestamptz default current_timestamp not null
-- );


-- -- SERVICES MODULE
-- -- 16. units ( units for services such as cm, count, m2 )
-- drop table if exists units cascade;
-- create table units (
-- 	unit_id bigserial not null primary key,
-- 	unit_name character varying(32) not null,
-- 	unit_created_at timestamptz default current_timestamp,
-- 	unit_deleted_at timestamptz default null
-- );

-- -- 17. services ( services company presents )
-- drop table if exists services cascade;
-- create table services (
-- 	service_id bigserial not null primary key,
-- 	service_name character varying(64) not null,
-- 	branch_id bigint not null references branches(branch_id),
-- 	service_created_at timestamptz default current_timestamp,
-- 	service_deleted_at timestamptz default null
-- );

-- -- 18. service prices ( prices for each service )
-- drop table if exists service_prices cascade;
-- create table service_prices (
-- 	price_id bigserial not null primary key,
-- 	price_amount bigint not null,
-- 	price_per bigint not null default 1,
-- 	price_special boolean not null,
-- 	service_id bigint not null references services(service_id),
-- 	unit_id bigint not null references units(unit_id),
-- 	price_created_at timestamptz default current_timestamp,
-- 	price_deleted_at timestamptz default null
-- );


-- -- ORDERS MODULE
-- -- 19. orders ( client orders )
-- drop table if exists orders cascade;
-- create table orders (
-- 	order_id bigserial not null primary key,
-- 	order_bring_time timestamptz default null,
-- 	order_delivery_time timestamptz default null,
-- 	order_special boolean default false,
-- 	order_status bigint default 1,
-- 	order_summary character varying(256),
-- 	client_id bigint not null references clients(client_id),
-- 	branch_id bigint not null references branches(branch_id),
-- 	address_id bigint not null references addresses(address_id),
-- 	order_created_at timestamptz default current_timestamp,
-- 	order_deleted_at timestamptz default null
-- );

-- -- 20. products ( products each order contains )
-- drop table if exists products cascade;
-- create table products (
-- 	product_id bigserial not null primary key,
-- 	product_size bigint default 1,
-- 	product_simple_price bigint not null,
-- 	product_special_price bigint not null,
-- 	product_name character varying(32) not null,
-- 	product_unit character varying(32) not null,
-- 	product_summary character varying(128),
-- 	product_status bigint not null default 1,
-- 	order_id bigint not null references orders(order_id),
-- 	product_created_at timestamptz default current_timestamp,
-- 	product_deleted_at timestamptz default null
-- );


-- -- TRANSPORT MODULE
-- -- 21. transport
-- drop table if exists transports cascade;
-- create table transports (
-- 	transport_id bigserial not null primary key,
-- 	transport_model character varying(64) not null,
-- 	transport_color character varying(32) not null,
-- 	transport_number character varying(64) not null,
-- 	transport_summary character varying(128),
-- 	branch_id bigint not null references branches(branch_id),
-- 	transport_broken boolean default false,
-- 	driver_id bigint references staffs(staff_id) default null,
-- 	transport_created_at timestamptz default current_timestamp,
-- 	transport_deleted_at timestamptz default null,
-- 	unique(driver_id)
-- );

-- -- 22. load order ( info about orders to which car they are loaded )
-- drop table if exists load_order cascade;
-- create table load_order (
-- 	load_order_id bigserial not null primary key,
-- 	order_id bigint not null references orders(order_id) unique,
-- 	transport_id bigint not null references transports(transport_id),
-- 	load_order_created_at timestamptz default current_timestamp,
-- 	load_order_deleted_at timestamptz default null,
-- 	unique (order_id, transport_id)
-- );





-- -- CASHIER MODULE
-- -- 27. transaction types
-- drop table if exists transaction_types cascade;
-- create table transaction_types (
-- 	transaction_type_id serial not null primary key,
-- 	transaction_type_name character varying(64),
-- 	transaction_type_role character varying(64)
-- );

-- -- 28. expanse types
-- drop table if exists expanse_types cascade;
-- create table expanse_types (
-- 	expanse_type_id serial not null primary key,
-- 	expanse_type_name character varying(128) not null,
-- 	expanse_created_at timestamptz default current_timestamp,
-- 	expanse_deleted_at timestamptz default null
-- );

-- -- 29. balance account ( for every accountant )
-- drop table if exists balance_account cascade;
-- create table balance_account (
-- 	balance_id serial not null primary key,
-- 	balance_money_amount int default 0,
-- 	balance_money_type smallint not null,
-- 	balance_owner int not null references staffs(staff_id),
-- 	balance_owner_role int not null references transaction_types(transaction_type_id),
-- 	balance_created_at timestamptz default current_timestamp,
-- 	balance_deleted_at timestamptz default null
-- );

-- -- 30. transactions
-- drop table if exists transactions cascade;
-- create table transactions (
-- 	transaction_id serial not null primary key,
-- 	transaction_money int not null,
-- 	transaction_money_type smallint not null,
-- 	transaction_type int not null references transaction_types(transaction_type_id),
-- 	transaction_from int not null references staffs(staff_id),
-- 	transaction_to int not null references staffs(staff_id),
-- 	transaction_verified boolean default false,
-- 	transaction_summary character varying(512),
-- 	transaction_created_at timestamptz default current_timestamp,
-- 	transaction_deleted_at timestamptz default null
-- );

-- -- 31. order transactions ( received money from orders )
-- drop table if exists order_transactions cascade;
-- create table order_transactions (
-- 	transaction_id serial not null primary key,
-- 	transaction_money int not null,
-- 	transaction_money_type smallint not null,
-- 	order_id int not null references orders(order_id),
-- 	driver_id int not null references staffs(staff_id),
-- 	transaction_summary character varying(512),
-- 	transaction_created_at timestamptz default current_timestamp,
-- 	transaction_deleted_at timestamptz default null
-- );

-- -- 32. expanses
-- drop table if exists expanses cascade;
-- create table expanses (
-- 	expanse_id serial not null primary key,
-- 	expanse_money int not null,
-- 	expanse_money_type smallint not null,
-- 	expanse_type int not null references expanse_types(expanse_type_id),
-- 	expanse_from int not null references staffs(staff_id),
-- 	expanse_to int not null references staffs(staff_id),
-- 	expanse_summary character varying(512),
-- 	expanse_created_at timestamptz default current_timestamp,
-- 	expanse_deleted_at timestamptz default null
-- );



