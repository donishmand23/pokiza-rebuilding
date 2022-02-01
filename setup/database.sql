-- DATABASE CONFIGURATION
\c postgres;
drop database if exists pokiza;
create database pokiza;
\c pokiza;

create extension "pgcrypto";

-- ADDRESS MODULE
-- 01. branches
drop table if exists branches cascade;
create table branches (
	branch_id bigserial not null primary key,
	branch_name character varying(128),
	branch_created_at timestamptz default current_timestamp,
	branch_deleted_at timestamptz default null
);

-- 02. states
drop table if exists states cascade;
create table states (
	state_id bigserial not null primary key,
	state_name character varying(64) not null,
	state_created_at timestamptz default current_timestamp,
	state_deleted_at timestamptz default null
);

-- 03. regions
drop table if exists regions cascade;
create table regions (
	region_id bigserial not null primary key,
	region_name character varying(64) not null,
	state_id bigint not null references states (state_id),
	branch_id bigint not null references branches (branch_id),
	region_created_at timestamptz default current_timestamp,
	region_deleted_at timestamptz default null
);

-- 04. neighborhoods
drop table if exists neighborhoods cascade;
create table neighborhoods (
	neighborhood_id bigserial not null primary key,
	neighborhood_name character varying(70) not null,
	neighborhood_distance numeric not null,
	region_id bigint not null references regions (region_id),
	neighborhood_created_at timestamptz default current_timestamp,
	neighborhood_deleted_at timestamptz default null
);

-- 05. streets
drop table if exists streets cascade;
create table streets (
	street_id bigserial not null primary key,
	street_name character varying(70) not null,
	street_distance numeric not null,
	street_created_at timestamptz default current_timestamp,
	street_deleted_at timestamptz default null
);

-- 06. areas
drop table if exists areas cascade;
create table areas (
	area_id bigserial not null primary key,
	area_name character varying(70) not null,
	area_distance numeric not null,
	area_created_at timestamptz default current_timestamp,
	area_deleted_at timestamptz default null
);

-- 07. neighborhood-streets ( join table to reference neighborhoods and streets )
drop table if exists neighborhood_streets cascade;
create table neighborhood_streets (
	neighborhood_street_id bigserial not null primary key,
	neighborhood_id bigint not null references neighborhoods(neighborhood_id),
	street_id bigint not null references streets(street_id),
	neighborhood_street_created_at timestamptz default current_timestamp,
	neighborhood_street_deleted_at timestamptz default null
);

-- 08. street-areas ( join table to reference streets and areas )
drop table if exists street_areas cascade;
create table street_areas (
	street_area_id bigserial not null primary key,
	street_id bigint not null references streets(street_id),
	area_id bigint not null references areas(area_id),
	street_area_created_at timestamptz default current_timestamp,
	street_area_deleted_at timestamptz default null
);

-- 09. addresses ( table for storing user and order adresses ) 
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


-- USER SYSTEM MODULE
-- 10. analitics (social sets to detect where the client hear from)
drop table if exists social_sets cascade;
create table social_sets (
	social_set_id serial not null primary key,
	social_set_name character varying(30) not null,
	social_set_icon text not null,
	social_set_created_at timestamptz default current_timestamp
);

-- 11. users ( general info for staffs and clients )
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
	user_deleted_contact character varying(12) default null,
	user_created_at timestamptz default current_timestamp,
	unique(user_main_contact)
);

-- 12. staffs
drop table if exists staffs cascade;
create table staffs (
	staff_id bigserial not null primary key,
	staff_img text,
	staff_summary character varying(128),
	user_id bigint not null references users (user_id),
	staff_created_at timestamptz default current_timestamp,
	staff_deleted_at timestamptz default null,
	unique(user_id)
);

-- 13. clients
drop table if exists clients cascade;
create table clients (
	client_id bigserial not null primary key,
	client_status smallint default 1,
	client_summary character varying(128),
	social_set_id bigint references social_sets(social_set_id),
	user_id bigint not null references users (user_id),
	client_created_at timestamptz default current_timestamp,
	client_deleted_at timestamptz default null,
	unique(user_id)
);


-- SERVICES MODULE
-- 14. services ( services company presents )
drop table if exists services cascade;
create table services (
	service_id bigserial not null primary key,
	service_name character varying(64) not null,
	service_unit character varying(64) not null,
	service_unit_keys varchar[] not null,
	service_price_special numeric not null,
	service_price_simple numeric not null,
	branch_id int not null references branches(branch_id),
	service_created_at timestamptz default current_timestamp,
	service_deleted_at timestamptz default null,
	service_active boolean default true,
	unique(service_name, branch_id, service_deleted_at),
	unique(service_name, branch_id, service_active)
);

-- 15. delivery hours (storing delivery hours for special and simple orders)
drop table if exists delivery_hours cascade;
create table delivery_hours (
	delivery_hour_id bigserial not null primary key,
	delivery_hour_special int not null, 
	delivery_hour_simple int not null,
	branch_id int not null references branches(branch_id),
	delivery_hour_created_at timestamptz default current_timestamp
);

-- ORDERS MODULE
-- 16. orders ( client orders )
drop table if exists orders cascade;
create table orders (
	order_id bigserial not null primary key,
	order_special boolean default false,	
	order_summary character varying(256),
	client_id bigint not null references clients(client_id),
	branch_id bigint not null references branches(branch_id),
	address_id bigint not null references addresses(address_id),
	order_bring_time timestamptz default null,
	order_brougth_time timestamptz default null,
	order_delivery_time timestamptz default null,
	order_delivered_time timestamptz default null,
	order_created_at timestamptz default current_timestamp,
	order_deleted_at timestamptz default null
);

-- 17. order status processes
drop table if exists order_statuses cascade;
create table order_statuses (
	order_status_id bigserial not null primary key,
	order_status_code smallint not null check (order_status_code in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
	order_id bigint not null references orders(order_id),
	staff_id bigint references staffs(staff_id),
	order_status_created_at timestamptz default current_timestamp
);

-- 18. products ( products each order contains )
drop table if exists products cascade;
create table products (
	product_id bigserial not null primary key,
	product_size smallint default 1,
	product_img text,
	product_size_details json not null,
	product_summary character varying(356),
	service_id bigint not null references services(service_id),
	order_id bigint not null references orders(order_id),
	product_created_at timestamptz default current_timestamp,
	product_deleted_at timestamptz default null
);

-- 19. product status processes
drop table if exists product_statuses cascade;
create table product_statuses (
	product_status_id bigserial not null primary key,
	product_status_code smallint not null check (product_status_code in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
	product_id bigint not null references products(product_id),
	staff_id bigint not null references staffs(staff_id),
	product_status_created_at timestamptz default current_timestamp
);


-- TRANSPORT MODULE
-- 21. transport
drop table if exists transports cascade;
create table transports (
	transport_id bigserial not null primary key,
	transport_model character varying(64) not null,
	transport_color character varying(32) not null,
	transport_number character varying(64) not null,
	transport_summary character varying(128),
	transport_img text,
	transport_broken boolean default false,
	branch_id bigint not null references branches(branch_id),
	transport_created_at timestamptz default current_timestamp,
	transport_deleted_at timestamptz default null
);

-- transport registration
drop table if exists transport_registration cascade;
create table transport_registration (
	registration_id bigserial not null primary key,
	staff_id bigint not null references staffs(staff_id),
	transport_id bigint not null references transports(transport_id),
	registered_at timestamptz default current_timestamp,
	unregistered_at timestamptz default null
);

-- order bindings
drop table if exists order_bindings cascade;
create table order_bindings (
	order_binding_id bigserial not null primary key,
	order_binding_type smallint not null check (order_binding_type in (1, 2)),
	transport_id bigint not null references transports(transport_id),
	order_id bigint references orders(order_id),
	product_id bigint references products(product_id),
	finished boolean default false,
	order_binding_created_at timestamptz default current_timestamp,
	order_binding_deleted_at timestamptz default null
);

-- EXTRA SERVICES 
-- 20. sms service
drop table if exists sms_service cascade;
create table sms_service (
	sms_service_id bigserial not null primary key,
	sms_service_email character varying(128) not null,
	sms_service_password character varying(128) not null,
	sms_service_token text not null,
	sms_service_created_at timestamptz default current_timestamp
);

-- 21. notifications (notifications sent to clients and staffs)
drop table if exists notifications cascade;
create table notifications (
	notification_id serial not null primary key,
	notification_from bigint not null references staffs(staff_id),
	notification_to bigint not null references users(user_id),
	notification_title character varying(300) not null,
	notification_body text not null,
	notification_img text,
	notification_created_at timestamptz default current_timestamp,
	notification_deleted_at timestamptz default null
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



