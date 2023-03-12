----------------------------   ADDRESS   ---------------------------------------

-- BRANCHES - filiallar
insert into branches (branch_name) values ('Toshkent');	
insert into branches (branch_name) values ('Qo''qon');
insert into branches (branch_name) values ('Andijon');


-- STATES - viloyatlar 
insert into states (state_name) values ('Andijon');    -- 1
insert into states (state_name) values ('Farg''ona');  -- 2
insert into states (state_name) values ('ToshkentSh'); -- 3
insert into states (state_name) values ('ToshkentV');  -- 4


-- REGIONS
-- regions of tashkent city
insert into regions (state_id, branch_id, region_name) values (3, 1, 'Olmazor');      -- 1
insert into regions (state_id, branch_id, region_name) values (3, 1, 'Chilonzor');    -- 2
insert into regions (state_id, branch_id, region_name) values (3, 1, 'Yunusobod');    -- 3

--regions of fargona 
insert into regions (state_id, branch_id, region_name) values (2, 2, 'Beshariq');     -- 4
insert into regions (state_id, branch_id, region_name) values (2, 2, 'Buvayda');      -- 5
insert into regions (state_id, branch_id, region_name) values (2, 2, 'Qo''qonSh');    -- 6

-- regions of tashkent state (viloyat)
insert into regions (state_id, branch_id, region_name) values (4, 1, 'Qibray');       -- 7
insert into regions (state_id, branch_id, region_name) values (4, 1, 'Chinoz');       -- 8


--NEIGHBORHOODS
-- neighborhoods of Olmazor
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (1, 'A', 3);   -- 1
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (1, 'B', 4);   -- 2

-- neighborhoods of Chilonzor
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (2, 'C', 2);   -- 3
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (2, 'D', 3);   -- 4

-- neighborhoods of Yunusobod
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (3, 'F', 2.5); -- 5
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (3, 'E', 4.3); -- 6

-- neighborhoods of Beshariq
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (4, 'P', 3.3); -- 7
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (4, 'Q', 4.1); -- 8

-- neighborhoods of Buvayda
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (5, 'W', 2);   -- 9
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (5, 'U', 1);   -- 10

-- neighborhoods of Qo'qon
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (6, 'R', 2);   -- 11
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (6, 'O', 1);   -- 12

-- neighborhoods of Qibray
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (7, 'Y', 2);   -- 13
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (7, 'Z', 1);   -- 14

-- neighborhoods of Qibray
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (8, 'S', 2);   -- 15
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (8, 'X', 1);   -- 16


--STREETS
insert into streets (street_name, street_distance) values ('ABX', 2.1); -- 1
insert into streets (street_name, street_distance) values ('POQ', 1);   -- 2
insert into streets (street_name, street_distance) values ('ASD', 6);   -- 3
insert into streets (street_name, street_distance) values ('MNY', 7);	-- 4
insert into streets (street_name, street_distance) values ('MBV', 3.5);	-- 5
insert into streets (street_name, street_distance) values ('CVE', 2.5);	-- 6
insert into streets (street_name, street_distance) values ('AZD', 3.5);	-- 7
insert into streets (street_name, street_distance) values ('BVI', 1);	-- 8
insert into streets (street_name, street_distance) values ('BYP', 1.3); -- 9
insert into streets (street_name, street_distance) values ('IUY', 1);   -- 10
insert into streets (street_name, street_distance) values ('AFD', 1);   -- 11
insert into streets (street_name, street_distance) values ('QTR', 2);   -- 12
insert into streets (street_name, street_distance) values ('LWT', 3);   -- 13
insert into streets (street_name, street_distance) values ('VBT', 1);   -- 14
insert into streets (street_name, street_distance) values ('RTY', 2);   -- 15


--NEIGHBORHOOD_STREETS
-- streets of A mahalla - Olmazor (ABX, POQ, ASD)
insert into neighborhood_streets (neighborhood_id, street_id) values (1, 1);
insert into neighborhood_streets (neighborhood_id, street_id) values (1, 2);
insert into neighborhood_streets (neighborhood_id, street_id) values (1, 3);

-- streets of B mahalla - Olmazor (ASD, MNY, MBV, CVE)
insert into neighborhood_streets (neighborhood_id, street_id) values (2, 3);
insert into neighborhood_streets (neighborhood_id, street_id) values (2, 4);
insert into neighborhood_streets (neighborhood_id, street_id) values (2, 5);
insert into neighborhood_streets (neighborhood_id, street_id) values (2, 6);

-- streets of C mahalla - Chilonzor (AZD, BVI, BYP)
insert into neighborhood_streets (neighborhood_id, street_id) values (3, 7);
insert into neighborhood_streets (neighborhood_id, street_id) values (3, 8);
insert into neighborhood_streets (neighborhood_id, street_id) values (3, 9);

-- streets of D mahalla - Chilonzor (BVI, BYP, IUY, AFD)
insert into neighborhood_streets (neighborhood_id, street_id) values (4, 8);
insert into neighborhood_streets (neighborhood_id, street_id) values (4, 9);
insert into neighborhood_streets (neighborhood_id, street_id) values (4, 10);
insert into neighborhood_streets (neighborhood_id, street_id) values (4, 11);

-- streets of R mahalla - Qo'qon (QTR, LWT, VBT)
insert into neighborhood_streets (neighborhood_id, street_id) values (11, 12);
insert into neighborhood_streets (neighborhood_id, street_id) values (11, 13);
insert into neighborhood_streets (neighborhood_id, street_id) values (11, 14);

-- streets of O mahalla - Qo'qon (VBT, RTY)
insert into neighborhood_streets (neighborhood_id, street_id) values (12, 14);
insert into neighborhood_streets (neighborhood_id, street_id) values (12, 15);


--AREAS 
insert into areas (area_name, area_distance) values ('alpha', 2);   -- 1
insert into areas (area_name, area_distance) values ('betta', 3);   -- 2
insert into areas (area_name, area_distance) values ('yepoo', 3.5); -- 3
insert into areas (area_name, area_distance) values ('loopp', 4);   -- 4
insert into areas (area_name, area_distance) values ('qwert', 1);   -- 5
insert into areas (area_name, area_distance) values ('tuulp', 4);   -- 6
insert into areas (area_name, area_distance) values ('jeerp', 3);   -- 7
insert into areas (area_name, area_distance) values ('cdert', 2.5); -- 8
insert into areas (area_name, area_distance) values ('zorri', 3);   -- 9
insert into areas (area_name, area_distance) values ('aswed', 1);   -- 10
insert into areas (area_name, area_distance) values ('pooll', 2);   -- 11
insert into areas (area_name, area_distance) values ('tyruu', 1);   -- 12
insert into areas (area_name, area_distance) values ('twerp', 3);   -- 13
insert into areas (area_name, area_distance) values ('keepa', 4);   -- 14
insert into areas (area_name, area_distance) values ('beeen', 2);   -- 15
insert into areas (area_name, area_distance) values ('reety', 3);   -- 16
insert into areas (area_name, area_distance) values ('tesrp', 1);   -- 17
insert into areas (area_name, area_distance) values ('liiia', 2);   -- 18
insert into areas (area_name, area_distance) values ('toole', 2.5); -- 19
insert into areas (area_name, area_distance) values ('veeme', 1.5); -- 20
 

--STREET_AREAS
-- areas of ABX street - A mahalla - Olmazor
insert into street_areas (street_id, area_id) values (1, 1);

-- areas of POQ street - A mahalla - Olmazor
insert into street_areas (street_id, area_id) values (2, 2);
insert into street_areas (street_id, area_id) values (2, 3);

-- areas of ASD street - (A mahalla - B mahalla) - Olmazor
insert into street_areas (street_id, area_id) values (3, 4);

-- areas of MNY street - B mahalla - Olmazor
insert into street_areas (street_id, area_id) values (4, 5);
insert into street_areas (street_id, area_id) values (4, 6);

-- areas of MBV street - B mahalla - Olmazor
insert into street_areas (street_id, area_id) values (5, 6);
insert into street_areas (street_id, area_id) values (5, 7);

-- areas of CVE street - B mahalla - Olmazor
insert into street_areas (street_id, area_id) values (6, 8);

-- areas of AZD street - C mahalla - Chilonzor
insert into street_areas (street_id, area_id) values (7, 9);

-- areas of BVI street - (C mahalla - D mahalla) - Chilonzor
insert into street_areas (street_id, area_id) values (8, 10);
insert into street_areas (street_id, area_id) values (8, 11);

-- areas of BYP street - (C mahalla - D mahalla) - Chilonzor
insert into street_areas (street_id, area_id) values (9, 11);
insert into street_areas (street_id, area_id) values (9, 12);

-- areas of IUY street - D mahalla - Chilonzor
insert into street_areas (street_id, area_id) values (10, 13);

-- areas of AFD street - D mahalla - Chilonzor
insert into street_areas (street_id, area_id) values (11, 13);
insert into street_areas (street_id, area_id) values (11, 14);
insert into street_areas (street_id, area_id) values (11, 15);

-- areas of QTR street - R mahalla - Qo'qon
insert into street_areas (street_id, area_id) values (12, 16);

-- areas of LWT street - R mahalla - Qo'qon
insert into street_areas (street_id, area_id) values (13, 16);
insert into street_areas (street_id, area_id) values (13, 17);

-- areas of VBT street - (R mahalla - O mahalla) - Qo'qon
insert into street_areas (street_id, area_id) values (14, 18);
insert into street_areas (street_id, area_id) values (14, 19);

-- areas of RTY street -  O mahalla - Qo'qon
insert into street_areas (street_id, area_id) values (15, 19);
insert into street_areas (street_id, area_id) values (15, 20);



--------------------------------   USER   -------------------------------------------

-- social sets (Ijtimoiy tarmoqlar)
insert into social_sets (social_set_name, social_set_icon) values 
('taishdan', '<svg id="group-line" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <path id="Path_1948" data-name="Path 1948" d="M0,0H30V30H0Z" fill="none"/>
  <path id="Path_1949" data-name="Path 1949" d="M2,29.892a11.007,11.007,0,1,1,22.013,0H21.262a8.255,8.255,0,1,0-16.51,0ZM13.007,17.51a8.255,8.255,0,1,1,8.255-8.255A8.253,8.253,0,0,1,13.007,17.51Zm0-2.752a5.5,5.5,0,1,0-5.5-5.5A5.5,5.5,0,0,0,13.007,14.758Zm11.4,5.095a11.009,11.009,0,0,1,6.488,10.039H28.141a8.257,8.257,0,0,0-4.868-7.531l1.13-2.509ZM23.457,4.32a7.57,7.57,0,0,1-2.2,14.536v-2.77a4.815,4.815,0,0,0,1.432-9.093Z" transform="translate(-1.262 -0.631)"/>
</svg>'),
('reklamadan', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36" height="36" viewBox="0 0 36 36">
  <image id="commercial" width="36" height="36" xlink:href="data:image/png;base64,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"/>
</svg>'),
('instagram', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7.082c1.602 0 1.792.006 2.425.035 1.627.074 2.385.845 2.46 2.459.028.633.034.822.034 2.424s-.006 1.792-.034 2.424c-.075 1.613-.832 2.386-2.46 2.46-.633.028-.822.035-2.425.035-1.602 0-1.792-.006-2.424-.035-1.63-.075-2.385-.849-2.46-2.46-.028-.632-.035-.822-.035-2.424s.007-1.792.035-2.424c.074-1.615.832-2.386 2.46-2.46.632-.029.822-.034 2.424-.034zm0-1.082c-1.63 0-1.833.007-2.474.037-2.18.1-3.39 1.309-3.49 3.489-.029.641-.036.845-.036 2.474 0 1.63.007 1.834.036 2.474.1 2.179 1.31 3.39 3.49 3.49.641.029.844.036 2.474.036 1.63 0 1.834-.007 2.475-.036 2.176-.1 3.391-1.309 3.489-3.49.029-.64.036-.844.036-2.474 0-1.629-.007-1.833-.036-2.474-.098-2.177-1.309-3.39-3.489-3.489-.641-.03-.845-.037-2.475-.037zm0 2.919c-1.701 0-3.081 1.379-3.081 3.081s1.38 3.081 3.081 3.081 3.081-1.379 3.081-3.081c0-1.701-1.38-3.081-3.081-3.081zm0 5.081c-1.105 0-2-.895-2-2 0-1.104.895-2 2-2 1.104 0 2.001.895 2.001 2s-.897 2-2.001 2zm3.202-5.922c-.397 0-.72.322-.72.72 0 .397.322.72.72.72.398 0 .721-.322.721-.72 0-.398-.322-.72-.721-.72z"/></svg>'),
('facebook', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"/></svg>'),
('telegram', '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="24px" height="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path id="telegram-5" d="M12,0c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12Zm0,2c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10c-5.514,0 -10,-4.486 -10,-10c0,-5.514 4.486,-10 10,-10Zm2.692,14.889c0.161,0.115 0.368,0.143 0.553,0.073c0.185,-0.07 0.322,-0.228 0.362,-0.42c0.435,-2.042 1.489,-7.211 1.884,-9.068c0.03,-0.14 -0.019,-0.285 -0.129,-0.379c-0.11,-0.093 -0.263,-0.12 -0.399,-0.07c-2.096,0.776 -8.553,3.198 -11.192,4.175c-0.168,0.062 -0.277,0.223 -0.271,0.4c0.006,0.177 0.125,0.33 0.296,0.381c1.184,0.354 2.738,0.847 2.738,0.847c0,0 0.725,2.193 1.104,3.308c0.047,0.139 0.157,0.25 0.301,0.287c0.145,0.038 0.298,-0.001 0.406,-0.103c0.608,-0.574 1.548,-1.461 1.548,-1.461c0,0 1.786,1.309 2.799,2.03Zm-5.505,-4.338l0.84,2.769l0.186,-1.754c0,0 3.243,-2.925 5.092,-4.593c0.055,-0.048 0.062,-0.13 0.017,-0.188c-0.045,-0.057 -0.126,-0.071 -0.188,-0.032c-2.143,1.368 -5.947,3.798 -5.947,3.798Z"/></svg>');

-- addresses (user uchun adresslar)
insert into addresses (state_id, region_id, neighborhood_id, street_id, area_id, address_home_number, address_target) values
/* 1 */ (3, 1, 1, 1, 1, '25', 'bozorga yaqin joyda'),                   -- ToshkentSh, Olmazor, A mahalla, ABX ko''cha, alpha hudud   
/* 2 */ (3, 2, 3, 7, 9, '12', 'bekat yaqinida'),                        -- ToshkentSh, Chilonzor, C mahalla, AZD ko''cha, zorri hudud
/* 3 */ (3, 2, 4, 10, 10, '16', '13-kvartal'),                           -- ToshkentSh, Chilonzor, D mahalla, IUY ko''cha, aswed hudud
/* 4 */ (3, 2, 4, 8, 10, '16', 'chilonzor metro'),                       -- ToshkentSh, Chilonzor, D mahalla, BVI ko''cha, aswed hudud
/* 5 */ (3, 2, 4, 11, 15, '95', 'svetafor oldidagi 4 etajli dom'),       -- ToshkentSh, Chilonzor, D mahalla, AFD ko''cha, beeen hudud
/* 6 */ (2, 6, 11, 12, 16, '105', 'Mini market orqasida'),              -- Farg''ona, Qo''qonSh, R mahalla, QTR ko''cha, reety hudud
/* 7 */ (2, 6, 11, 13, 17, '5', 'supreme degan do''kon ro''parasida'),  -- Farg''ona, Qo''qonSh, R mahalla, LWT ko''cha, tesrp hudud
/* 8 */ (2, 6, 12, 14, 19, '13', 'nasiyaSavdo do''koni orqa tomoni');   -- Farg''ona, Qo''qonSh, O mahalla, VBT ko''cha, toole hudud

-- users (userlar)
insert into users (user_main_contact, user_second_contact, user_password, user_first_name, user_last_name, user_birth_date, user_gender, branch_id, address_id) values
/* 1 */('998946209914', '998994523145', crypt('admin@1', gen_salt('bf')), 'Abdulhakim', 'Shodiyev', '1994-03-23', 1, 1, 1),
/* 2 */('998942256598', '998934563215', crypt('pokiza@1', gen_salt('bf')), 'Hadicha', 'Malikova', '2000-04-05', 2, 1, 2),
/* 3 */('998942362103', '998334561203', crypt('pokiza@1', gen_salt('bf')), 'Sardor', 'Shavkatov', '2001-11-10', 1, 1, 3),
/* 4 */('998332203689', '998971034579', crypt('pokiza@1', gen_salt('bf')), 'Abdulloh', 'Nasriddinov', '1995-07-25', 1, 1, 4),
/* 5 */('998337894561', '998906419734', crypt('pokiza@1', gen_salt('bf')), 'Nigora', 'Yo''ldosheva', '1998-09-13', 2, 1, 5),
/* 6 */('998951023265', '998912037894', crypt('pokiza@1', gen_salt('bf')), 'Alisher', 'Nazirov', '1984-10-10', 1, 2, 6),
/* 7 */('998331234567', '998972013265', crypt('pokiza@1', gen_salt('bf')), 'Muhammad', 'Soliyev', '1990-04-29', 1, 2, 7),
/* 8 */('998337844561', '998917361489', crypt('pokiza@1', gen_salt('bf')), 'Gavhar', 'Hikmatova', '1991-03-15', 2, 2, 8);

/*
	address and user for client and staff
	
	1 -> root admin
	2 -> staff (Toshkent)
	3 -> staff (Toshkent)
	4 -> client (Toshkent)
	5 -> client (Toshkent)
	6 -> staff (Qo'qon)
	7 -> client (Qo'qon)
	8 -> client (Qo'qon)
*/

/*
	client statuses -> 1, 2, 3, 4
*/

-- clients (mijozlar)
/* 1 */insert into clients (user_id, social_set_id, client_status, client_summary) values (4, 1, 1, 'injiqroq klient. Yaxshi gaplashinglar!');
/* 2 */insert into clients (user_id, social_set_id, client_status, client_summary) values (5, 2, 3, 'yaxshi klient');
/* 3 */insert into clients (user_id, social_set_id, client_status, client_summary) values (7, 3, 4, 'o''tgan safar pulini bermagan');
/* 4 */insert into clients (user_id, social_set_id, client_status, client_summary) values (8, 1, 2, null);


-- staffs (xodimlar)
insert into staffs (user_id, staff_img, staff_summary) values 
/* 1 */(1, 'abdulhakim.jpg', 'super admin'),
/* 2 */(2, 'hadicha.jpg', 'Yuvuvchi. Yaxshi ishchi'),
/* 3 */(3, 'sardor.jpg', null),
/* 4 */(6, 'alisher.jpg', 'Ajoyib xodim');



--------------------------------   SERVICE   -----------------------------------------

-- sms service
insert into sms_service (sms_service_email, sms_service_password, sms_service_token) values 
(
	'Pokizakokand@gmail.com', 
	'ktpsULFrwxqXctn9SyqIxsJxugveveppOY0oDvTa', 
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbm90aWZ5LmVza2l6LnV6XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjEzNDEwMzI4LCJleHAiOjE2MTYwMDIzMjgsIm5iZiI6MTYxMzQxMDMyOCwianRpIjoiOWZ3QTVoSnFpNDkwVEc2UCIsInN1YiI6Mzk0LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.hOaTEJkdt_WNBU56cAnL_uBX3LZ5xLdGmGee12d0VqY'
);

-- notification
insert into notifications(notification_from, notification_to, notification_img, notification_title, notification_body) values
/* to staff */  (1, 2, 'cong.jpg', 'Tabriknoma', 'Siz jamoamizdagi eng yaxshi xodimsiz. Sizga Pokiza nomidan rahmat aytamiz'),
/* to staff */  (3, 2, 'alert.jpg', 'Shoshilinch', 'Tezda ombordagi 01256 raqamli gilamni yuvish kerak!'),
/* to staff */  (1, 2, 'farewell.png', 'Vidolashuv', 'Kompaniyamizga qo''shgan xissangiz uchun rahmat'),
/* to staff */  (1, 3, 'farewell.png', 'Vidolashuv', 'Kompaniyamizga qo''shgan xissangiz uchun rahmat'),
/* to staff */  (1, 6, 'promotion.jpg', 'Promotion', 'Sizni Toshkent filialiga o''tkazmoqchimiz'),
/* to client */ (2, 4, 'cong.jpg', 'Yaxshi yangilik!', 'Siz Pokiza gilam yuvish fabrikasi tomonidan o''tkazilgan aksiyada g''olib bo''ldingiz. Tabriklaymiz!'),
/* to client */ (2, 5, 'cong.jpg', 'Yaxshi yangilik!', 'Siz Pokiza gilam yuvish fabrikasi tomonidan o''tkazilgan aksiyada g''olib bo''ldingiz. Tabriklaymiz!'),
/* to client */ (1, 5, 'announcement.jpg', 'Elon', 'Siz fabrikamizga kelib sovg''angizni olib ketishingiz kerak!');

-- services
insert into services (service_name, service_unit, service_unit_keys, service_price_special, service_price_simple, branch_id) values
/* 1 */('gilam', 'm2', ARRAY['eni', 'boyi'], 12000, 7000, 1),
/* 2 */('gilam', 'm2', ARRAY['eni', 'boyi'], 12000, 7000, 2),
/* 3 */('sholcha', 'dona', ARRAY['qiymat'], 9000, 6500, 1),
/* 4 */('parda', 'kg', ARRAY['qiymat'], 9500, 7500, 1),
/* 5 */('parda', 'kg', ARRAY['qiymat'], 8000, 6000, 2);

-- delivery hours
insert into delivery_hours(delivery_hour_special, delivery_hour_simple, branch_id) values 
(172800, 259200, 1),
(172800, 259200, 2);



-----------------------------------------   ORDERS   ------------------------------------------------
-- addresses (buyurtmalar uchun adresslar)
insert into addresses (state_id, region_id, neighborhood_id, street_id, area_id, address_home_number, address_target) values
/* 9  */ (3, 1, 1, 1, 1, '25', 'bozorga yaqin joyda'),                   -- ToshkentSh, Olmazor, A mahalla, ABX ko''cha, alpha hudud   
/* 10 */ (3, 2, 3, 7, 9, '12', 'bekat yaqinida'),                        -- ToshkentSh, Chilonzor, C mahalla, AZD ko''cha, zorri hudud
/* 11 */ (3, 2, 4, 10, 10, '16', '13-kvartal'),                          -- ToshkentSh, Chilonzor, D mahalla, IUY ko''cha, aswed hudud
/* 12 */ (2, 6, 11, 13, 17, '5', 'supreme degan do''kon ro''parasida'),  -- Farg''ona, Qo''qonSh, R mahalla, LWT ko''cha, tesrp hudud
/* 13 */ (2, 6, 12, 14, 19, '13', 'nasiyaSavdo do''koni orqa tomoni');   -- Farg''ona, Qo''qonSh, O mahalla, VBT ko''cha, toole hudud

-- orders
insert into orders (client_id, branch_id, address_id, order_special, order_bring_time, order_delivery_time) values
/* 1 */ (1, 1, 9, true, NOW() + '86400 second'::INTERVAL, NOW() + '86400 second'::INTERVAL + '172800 second'::INTERVAL),
/* 2 */ (2, 1, 10, false, NOW() + '64800 second'::INTERVAL, NOW() + '64800 second'::INTERVAL + '259200 second'::INTERVAL),
/* 3 */ (2, 1, 10, true, NOW() + '172800 second'::INTERVAL, null),
/* 4 */ (3, 2, 11, false, NOW() + '100800 second'::INTERVAL, null);

insert into orders (
	client_id, 
	branch_id, 
	address_id, 
	order_special, 
	order_bring_time, 
	order_delivery_time, 
	order_brougth_time,
	order_delivered_time
) values
/* 5 */ (
	1, 
	1, 
	9, 
	true, 
	NOW() + '100800 second'::INTERVAL, 
	NOW() + '100800 second'::INTERVAL + '172800 second'::INTERVAL,
	NOW() + '109900 second'::INTERVAL,
	NOW() + '100800 second'::INTERVAL + '180800 second'::INTERVAL
);

insert into orders (
	client_id, 
	branch_id, 
	address_id, 
	order_special, 
	order_bring_time, 
	order_delivery_time, 
	order_brougth_time,
	order_delivered_time
) values
/* 6 */ (
	4, 
	2, 
	12, 
	true, 
	NOW() + '100800 second'::INTERVAL, 
	NOW() + '100800 second'::INTERVAL + '172800 second'::INTERVAL,
	NOW() + '109900 second'::INTERVAL,
	NOW() + '100800 second'::INTERVAL + '180800 second'::INTERVAL
);

-- order statuses
insert into order_statuses (order_id, staff_id, order_status_code) values
(1, null, 1),
(1, 2, 2),
(1, 3, 3),
(1, 3, 4),
(2, 2, 2),
(2, 2, 3),
(2, 3, 4),
(3, null, 1),
(4, null, 1),
(5, null, 1),
(5, 2, 2),
(5, 2, 3),
(5, 3, 4),
(5, 2, 5),
(5, 2, 6),
(5, 2, 7),
(5, 3, 8),
(5, 3, 9),
(6, null, 1),
(6, 4, 2);

-- products
insert into products (order_id, service_id, product_size, product_size_details, product_img, product_summary) values
/* 1 */(1, 1, 6, '{ "eni": 3, "bo''yi": 2 }', 'gilam01.jpg', 'gilamni cheti kuygan ekan'), 
/* 2 */(1, 1, 4, '{ "eni": 2, "bo''yi": 2 }', 'gilam02.jpg', null), 
/* 3 */(1, 3, 1, '{ "qiymat": 1 }', 'sholcha.jpg', null),
/* 4 */(2, 4, 2, '{ "qiymat": 2 }', 'parda.jpg', 'sarg''ayib ketgan parda ekan'),
/* 5 */(2, 1, 8, '{ "eni": 4, "bo''yi": 4 }', 'gilam03.jpg', null),
/* 6 */(5, 1, 32, '{ "eni": 4, "bo''yi": 8 }', 'gilam03.jpg', null),
/* 7 */(5, 3, 1, '{ "qiymat": 1 }', 'sholcha.jpg', null);

-- product statuses
insert into product_statuses (product_id, staff_id, product_status_code) values
(1, 3, 1),
(1, 2, 2),
(1, 2, 3),
(1, 2, 4),
(1, 2, 5),
(1, 2, 6),
(1, 2, 7),
(1, 2, 5),
(1, 2, 6),
(1, 2, 7),
(1, 2, 8),
(1, 3, 9),
(1, 3, 10),
(2, 3, 1),
(3, 3, 1),
(4, 3, 1),
(5, 3, 1),
(6, 3, 1),
(6, 2, 2),
(6, 2, 3),
(6, 2, 4),
(6, 2, 5),
(6, 2, 6),
(6, 2, 7),
(6, 2, 8),
(6, 3, 9),
(6, 3, 10),
(7, 3, 1),
(7, 2, 2),
(7, 2, 3),
(7, 2, 4),
(7, 2, 5),
(7, 2, 6),
(7, 2, 7),
(7, 2, 8),
(7, 3, 9),
(7, 3, 10);


-- Transport
insert into transports(branch_id, transport_model, transport_color, transport_number, transport_img, transport_summary) values
(1, 'Damas', 'white', 'AB987G', 'damas.jpg', 'yaxshi'),
(1, 'Nexia', 'red', 'AB879G', 'nexia.jpg', 'yomon'),
(2, 'Gazel', 'green', 'AB123G', 'gazel.jpg', 'ajoyib'),
(2, 'Labo', 'blue', 'AB987G', 'labo.jpg', 'ajoyib');


-- transport registration
insert into transport_registration (staff_id, transport_id, registered_at, unregistered_at) values (1, 1, NOW() - '200800 second'::INTERVAL, NOW() - '170800 second'::INTERVAL);
insert into transport_registration (staff_id, transport_id, registered_at, unregistered_at) values (3, 1, NOW() - '170000 second'::INTERVAL, NOW() - '110000 second'::INTERVAL);
insert into transport_registration (staff_id, transport_id, registered_at, unregistered_at) values (3, 2, NOW() - '10000 second'::INTERVAL, null);

-- order_bindings
insert into order_bindings (transport_id, order_id, product_id, order_binding_type, finished) values
(1, 1, null, 2, false),
(1, 2, null, 2, false),
(2, 5, null, 2, true),
(1, 5, null, 1, true),
(2, null, 1, 1, false);


--------------------------------------------------------------- FINANCE --------------------------------------------------------------
-- order transactions
insert into order_transactions (
	transaction_type,
	transaction_money_cash,
	transaction_money_card,
	order_id,
	staff_id,
	transaction_summary
) values 
('income', 300000, 93000, 5, 3, 'gilam yetkazildi!');

-- balance
insert into balances (balance_money_cash, balance_money_card, staff_id) values
(900000, 60000, 1),
(300000, 93000, 3);


-- expanse types
insert into expanses (expanse_name) values ('Benzin');
insert into expanses (expanse_name) values ('Qurilish');
insert into expanses (expanse_name) values ('Bazm uyushtirish');

-------------------------------------------------------------PERMISSIONS----------------------------------------------------------------
-- permissions
insert into permissions (permission_action, permission_model) values     
(1100, 'Filialni ko''rish (o''chirilgan)'),
(1101, 'Filialni qo''shish'),        
(1102, 'Filialni o''zgartirish'),        
(1103, 'Filialni o''chirish'),
(1104, 'Filialni qayta tiklash'),
      
(1200, 'Manzilni ko''rish (o''chirilgan)'),
(1201, 'Manzilni qo''shish'),
(1202, 'Manzilni o''zgartirish'),      
(1203, 'Manzilni o''chirish'),     
(1204, 'Manzilni qayta tiklash'),     
          
(1300, 'Mijozni ko''rish'),           
(1301, 'Mijozni qo''shish'),
(1302, 'Mijozni o''zgartirish'),        
(1303, 'Mijozni o''chirish'),
(1304, 'Mijozni qayta tiklash'),
     
(1400, 'Xodimni ko''rish'),            
(1401, 'Xodimni qo''shish'),       
(1402, 'Xodimni o''zgartirish'),       
(1403, 'Xodimni o''chirish'),
(1404, 'Xodimni qayta tiklash'),

(1500, 'Buyurtmani ko''rish'),            
(1501, 'Buyurtmani qo''shish'),         
(1502, 'Buyurtmani o''zgartirish'),         
(1503, 'Buyurtmani o''chirish'), 
(1504, 'Buyurtmani qayta tiklash'),   

(1600, 'Buyumni ko''rish'),               
(1601, 'Buyumni qo''shish'),           
(1602, 'Buyumni o''zgartirish'),           
(1603, 'Buyumni o''chirish'),   
(1604, 'Buyumni qayta tiklash'), 

(1700, 'Servisni ko''rish'),             
(1701, 'Servisni qo''shish'),         
(1702, 'Servisni o''zgartirish'), 
(1703, 'Servisni o''chirish'), 
(1704, 'Servisni qayta tiklash'),

(1800, 'Transportni ko''rish'), 
(1801, 'Transportni qo''shish'), 
(1802, 'Transportni o''zgartirish'), 
(1803, 'Transportni o''chirish'), 
(1804, 'Transportni qayta tiklash'),
(1805, 'Transportga buyurtma/buyum biriktirish'),                    
(1806, 'Transportdan buyurtma/buyum olib tashlash'),
(1807, 'Transportga xodim biriktirish'),
(1808, 'Transportdan xodim olib tashlash'),

(1900, 'Huquqlarni ko''rish'),
(1901, 'Huquqlarni qo''shish'),

(2101, 'Buyurtma holatini "Moderator"ga o''zgartirish'),     
(2102, 'Buyurtma holatini "Kutilmoqda"ga o''zgartirish'),     
(2103, 'Buyurtma holatini "Biriktirilgan"ga o''zgartirish'),     
(2104, 'Buyurtma holatini "Haydovchida"ga o''zgartirish'),     
(2105, 'Buyurtma holatini "Jarayonda"ga o''zgartirish'),     
(2106, 'Buyurtma holatini "Tayyor"ga o''zgartirish'),     
(2107, 'Buyurtma holatini "Yuklanmoqda"ga o''zgartirish'),     
(2108, 'Buyurtma holatini "Yetkazib berishda"ga o''zgartirish'),     
(2109, 'Buyurtma holatini "Yetkazildi"ga o''zgartirish'),     
(2110, 'Buyurtma holatini "Qisman yetkazildi"ga o''zgartirish'),

(2201, 'Buyum holatini "Haydovchida"ga o''zgartirish'),  
(2202, 'Buyum holatini "Yetib keldi"ga o''zgartirish'),  
(2203, 'Buyum holatini "Yuvilishda"ga o''zgartirish'),  
(2204, 'Buyum holatini "Quritishda"ga o''zgartirish'),  
(2205, 'Buyum holatini "Qadoqlashda"ga o''zgartirish'),  
(2206, 'Buyum holatini "Omborda"ga o''zgartirish'),  
(2207, 'Buyum holatini "Tayyor"ga o''zgartirish'),  
(2208, 'Buyum holatini "Yuklanmoqda"ga o''zgartirish'),  
(2209, 'Buyum holatini "Yetkazib berishda"ga o''zgartirish'),  
(2210, 'Buyum holatini "Yetkazildi"ga o''zgartirish'),    

(2300, 'Mijozga sms/xabarnoma yuborish'), 
(2301, 'Xodimga sms/xabarnoma yuborish'),
(2302, 'Xabarnomani o''chirish'),
(2303, 'Buyurtmaning taxminiy yetkazib berish vaqtini o''zgartirish'),
(2304, 'Monitoringni ko''rish'),
(2305, 'Global qidiruv'),
(2306, 'Statistikani ko''rish'),

(2400, 'Shaxsiy hisobni ko''rish'),
(2401, 'Barcha hisoblarni ko''rish'),
(2402, 'Filial hisoblarini ko''rish'),

(2500, 'Shaxsiy buyurtma o''tkazmalarini ko''rish'),
(2501, 'Barcha buyurtma o''tkazmalarini ko''rish'),
(2502, 'Shaxsiy buyurtmalar uchun o''tkazma amalga oshirish'),
(2503, 'Barcha buyurtmalar uchun o''tkazma amalga oshirish'),
(2504, 'Shaxsiy buyurtma o''tkazmalarini o''zgartirish'),
(2505, 'Barcha buyurtma o''tkazmalarini o''zgartirish'),
(2506, 'Shaxsiy buyurtma o''tkazmalarini o''chirish'),
(2507, 'Barcha buyurtma o''tkazmalarini o''chirish'),

(2600, 'Shaxsiy haqdorlik/qarzdorliklarni ko''rish'),
(2601, 'Barcha haqdorlik/qarzdorliklarni ko''rish'),
(2602, 'Shaxsiy oldi/berdi o''tkazmalarini ko''rish'),
(2603, 'Barcha oldi/berdi o''tkazmalarini ko''rish'),
(2604, 'Shaxsiy oldi/berdi kirim o''tkazmasini amalga oshirish'),
(2605, 'Barcha oldi/berdi kirim o''tkazmasini amalga oshirish'),
(2606, 'Shaxsiy oldi/berdi chiqim o''tkazmasini amalga oshirish'),
(2607, 'Barcha oldi/berdi chiqim o''tkazmasini amalga oshirish'),
(2608, 'Shaxsiy oldi/berdi o''tkazmalarini qabul qilish'),
(2609, 'Barcha oldi/berdi o''tkazmalarini qabul qilish'),
(2610, 'Shaxsiy oldi/berdi o''tkazmalarini bekor qilish'),
(2611, 'Barcha oldi/berdi o''tkazmalarini qabul qilish'),
(2612, 'Shaxsiy oldi/berdi o''tkazmalarini o''zgartirish'),
(2613, 'Barcha oldi/berdi o''tkazmalarini o''zgartirish'),
(2614, 'Shaxsiy oldi/berdi o''tkazmalarini o''chirish'),
(2615, 'Barcha oldi/berdi o''tkazmalarini o''chirish'),

(2700, 'Shaxsiy pul o''tkazmalarini ko''rish'),
(2701, 'Barcha pul o''tkazmalarini ko''rish'),
(2702, 'Shaxsiy pul o''tkazmasini amalga oshirish'),
(2703, 'Barcha pul o''tkazmasini amalga oshirish'),
(2704, 'Shaxsiy pul o''tkazmalarini qabul qilish'),
(2705, 'Barcha pul o''tkazmalarini qabul qilish'),
(2706, 'Shaxsiy pul o''tkazmalarini bekor qilish'),
(2707, 'Barcha pul o''tkazmalarini bekor qilish'),
(2708, 'Shaxsiy pul o''tkazmalarini o''zgartirish'),
(2709, 'Barcha pul o''tkazmalarini o''zgartirish'),
(2710, 'Shaxsiy pul o''tkazmalarini o''chirish'),
(2711, 'Barcha pul o''tkazmalarini o''chirish'),

(2800, 'Shaxsiy xarajat o''tkazmalarini ko''rish'),
(2801, 'Barcha xarajat o''tkazmalarini ko''rish'),
(2802, 'Shaxsiy xarajat o''tkazmasini amalga oshirish'),
(2803, 'Barcha xarajat o''tkazmasini amalga oshirish'),
(2804, 'Shaxsiy xarajat o''tkazmalarini qabul qilish'),
(2805, 'Barcha xarajat o''tkazmalarini qabul qilish'),
(2806, 'Shaxsiy xarajat o''tkazmalarini bekor qilish'),
(2807, 'Barcha xarajat o''tkazmalarini bekor qilish'),
(2808, 'Shaxsiy xarajat o''tkazmalarini o''zgartirish'),
(2809, 'Barcha xarajat o''tkazmalarini o''zgartirish'),
(2810, 'Shaxsiy xarajat o''tkazmalarini o''chirish'),
(2811, 'Barcha xarajat o''tkazmalarini o''chirish'),
(2812, 'Xarajat turini qo''shish'),
(2813, 'Xarajat turini o''chirish'),

(2900, 'Fond o''tkazmalarini ko''rish'),
(2901, 'Fond o''tkazmasini amalga oshirish'),
(2902, 'Fond o''tkazmalarini qabul qilish'),
(2903, 'Fond o''tkazmalarini bekor qilish'),
(2904, 'Fond o''tkazmalarini o''zgartirish'),
(2905, 'Fond o''tkazmalarini o''chirish');

-- Abdulhakim permissions branch 1
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1100);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1101);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1102);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1103);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1104);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1200);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1201);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1202);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1203);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1204);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1300);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1301);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1302);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1303);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1304);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1400);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1401);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1402);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1403);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1404);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1500);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1501);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1502);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1503);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1504);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1600);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1601);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1602);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1603);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1604);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1700);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1701);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1702);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1703);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1704);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1800);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1801);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1802);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1803);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1804);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1805);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1806);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1807);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1808);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1900);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 1901);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2101);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2102);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2103);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2104);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2105);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2106);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2107);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2108);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2109);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2110);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2201);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2202);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2203);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2204);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2205);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2206);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2207);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2208);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2209);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2210);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2300);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2301);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2302);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2303);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2304);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2305);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2306);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2400);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2401);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2402);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2500);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2501);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2502);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2503);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2504);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2505);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2506);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2507);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2600);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2601);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2602);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2603);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2604);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2605);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2606);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2607);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2608);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2609);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2610);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2611);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2612);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2613);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2614);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2615);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2700);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2701);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2702);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2703);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2704);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2705);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2706);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2707);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2708);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2709);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2710);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2711);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2800);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2801);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2802);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2803);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2804);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2805);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2806);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2807);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2808);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2809);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2810);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2811);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2812);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2813);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2900);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2901);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2902);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2903);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2904);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 1, 2905);
-- Abdulhakim permissions branch 2
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1100);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1101);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1102);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1103);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1104);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1200);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1201);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1202);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1203);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1204);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1300);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1301);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1302);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1303);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1304);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1400);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1401);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1402);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1403);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1404);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1500);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1501);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1502);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1503);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1504);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1600);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1601);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1602);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1603);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1604);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1700);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1701);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1702);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1703);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1704);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1800);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1801);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1802);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1803);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1804);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1805);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1806);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1807);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1808);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1900);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 1901);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2101);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2102);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2103);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2104);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2105);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2106);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2107);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2108);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2109);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2110);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2201);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2202);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2203);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2204);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2205);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2206);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2207);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2208);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2209);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2210);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2300);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2301);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2302);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2303);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2304);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2305);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2306);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2400);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2401);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2402);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2500);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2501);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2502);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2503);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2504);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2505);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2506);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2507);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2600);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2601);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2602);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2603);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2604);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2605);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2606);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2607);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2608);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2609);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2610);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2611);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2612);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2613);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2614);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2615);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2700);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2701);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2702);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2703);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2704);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2705);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2706);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2707);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2708);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2709);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2710);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2711);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2800);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2801);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2802);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2803);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2804);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2805);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2806);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2807);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2808);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2809);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2810);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2811);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2812);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2813);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2900);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2901);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2902);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2903);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2904);
insert into permission_sets (staff_id, branch_id, permission_action) values (1, 2, 2905);

-- Sardor permissions branch 1
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1100);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1101);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1102);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1103);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1104);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1200);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1201);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1202);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1203);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1204);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1300);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1301);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1302);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1303);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1304);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1400);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1401);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1402);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1403);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1404);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1500);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1501);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1502);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1503);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1504);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1600);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1601);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1602);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1603);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1604);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1700);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1701);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1702);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1703);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1704);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1800);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1801);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1802);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1803);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1804);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1805);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1806);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1807);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1808);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1900);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 1901);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2101);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2102);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2103);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2104);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2105);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2106);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2107);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2108);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2109);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2110);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2201);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2202);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2203);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2204);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2205);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2206);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2207);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2208);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2209);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2210);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2300);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2301);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2302);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2303);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2304);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2305);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2306);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2400);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2401);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2402);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2500);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2501);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2502);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2503);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2504);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2505);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2506);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2507);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2600);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2601);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2602);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2603);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2604);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2605);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2606);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2607);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2608);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2609);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2610);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2611);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2612);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2613);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2614);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2615);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2700);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2701);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2702);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2703);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2704);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2705);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2706);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2707);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2708);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2709);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2710);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2711);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2800);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2801);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2802);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2803);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2804);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2805);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2806);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2807);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2808);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2809);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2810);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2811);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2812);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2813);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2900);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2901);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2902);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2903);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2904);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 1, 2905);
-- Sardor permissions branch 2
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1100);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1101);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1102);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1103);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1104);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1200);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1201);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1202);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1203);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1204);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1300);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1301);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1302);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1303);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1304);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1400);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1401);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1402);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1403);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1404);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1500);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1501);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1502);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1503);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1504);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1600);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1601);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1602);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1603);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1604);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1700);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1701);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1702);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1703);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1704);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1800);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1801);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1802);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1803);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1804);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1805);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1806);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1807);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1808);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1900);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 1901);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2101);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2102);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2103);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2104);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2105);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2106);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2107);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2108);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2109);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2110);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2201);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2202);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2203);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2204);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2205);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2206);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2207);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2208);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2209);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2210);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2300);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2301);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2302);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2303);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2304);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2305);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2306);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2400);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2401);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2402);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2500);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2501);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2502);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2503);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2504);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2505);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2506);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2507);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2600);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2601);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2602);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2603);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2604);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2605);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2606);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2607);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2608);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2609);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2610);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2611);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2612);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2613);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2614);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2615);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2700);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2701);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2702);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2703);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2704);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2705);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2706);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2707);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2708);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2709);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2710);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2711);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2800);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2801);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2802);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2803);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2804);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2805);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2806);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2807);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2808);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2809);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2810);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2811);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2812);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2813);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2900);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2901);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2902);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2903);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2904);
insert into permission_sets (staff_id, branch_id, permission_action) values (3, 2, 2905);

-- Alisher permission
insert into permission_sets (staff_id, branch_id, permission_action) values (4, 2, 2900);

insert into permission_groups (group_name) values ('moderator');
insert into permission_groups (group_name) values ('haydovchi');

insert into permission_group_sets (group_id, permission_action) values (1, 1500);
insert into permission_group_sets (group_id, permission_action) values (1, 1501);
insert into permission_group_sets (group_id, permission_action) values (1, 1502);
insert into permission_group_sets (group_id, permission_action) values (1, 1503);
insert into permission_group_sets (group_id, permission_action) values (1, 1806);
insert into permission_group_sets (group_id, permission_action) values (1, 1807);
insert into permission_group_sets (group_id, permission_action) values (1, 2101);
insert into permission_group_sets (group_id, permission_action) values (1, 2102);

insert into permission_group_sets (group_id, permission_action) values (2, 1800);
insert into permission_group_sets (group_id, permission_action) values (2, 1803);
insert into permission_group_sets (group_id, permission_action) values (2, 1804);
insert into permission_group_sets (group_id, permission_action) values (2, 1805);
insert into permission_group_sets (group_id, permission_action) values (2, 1806);
insert into permission_group_sets (group_id, permission_action) values (2, 1807);
insert into permission_group_sets (group_id, permission_action) values (2, 1808);