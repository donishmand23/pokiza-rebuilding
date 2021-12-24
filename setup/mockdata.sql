----------------------------   ADDRESS   ---------------------------------------

-- BRANCHES - filiallar
insert into branches (branch_name) values ('Toshkent');	
insert into branches (branch_name) values ('Qo''qon');


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
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (1, 'A mahalla', 3);   -- 1
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (1, 'B mahalla', 4);   -- 2

-- neighborhoods of Chilonzor
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (2, 'C mahalla', 2);   -- 3
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (2, 'D mahalla', 3);   -- 4

-- neighborhoods of Yunusobod
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (3, 'F mahalla', 2.5); -- 5
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (3, 'E mahalla', 4.3); -- 6

-- neighborhoods of Beshariq
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (4, 'P mahalla', 3.3); -- 7
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (4, 'Q mahalla', 4.1); -- 8

-- neighborhoods of Buvayda
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (5, 'W mahalla', 2);   -- 9
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (5, 'U mahalla', 1);   -- 10

-- neighborhoods of Qo'qon
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (6, 'R mahalla', 2);   -- 11
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (6, 'O mahalla', 1);   -- 12

-- neighborhoods of Qibray
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (7, 'Y mahalla', 2);   -- 13
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (7, 'Z mahalla', 1);   -- 14

-- neighborhoods of Qibray
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (8, 'S mahalla', 2);   -- 15
insert into neighborhoods (region_id, neighborhood_name, neighborhood_distance) values (8, 'X mahalla', 1);   -- 16


--STREETS
insert into streets (street_name, street_distance) values ('ABX ko''cha', 2.1); -- 1
insert into streets (street_name, street_distance) values ('POQ ko''cha', 1);   -- 2
insert into streets (street_name, street_distance) values ('ASD ko''cha', 6);   -- 3
insert into streets (street_name, street_distance) values ('MNY ko''cha', 7);	-- 4
insert into streets (street_name, street_distance) values ('MBV ko''cha', 3.5);	-- 5
insert into streets (street_name, street_distance) values ('CVE ko''cha', 2.5);	-- 6
insert into streets (street_name, street_distance) values ('AZD ko''cha', 3.5);	-- 7
insert into streets (street_name, street_distance) values ('BVI ko''cha', 1);	-- 8
insert into streets (street_name, street_distance) values ('BYP ko''cha', 1.3); -- 9
insert into streets (street_name, street_distance) values ('IUY ko''cha', 1);   -- 10
insert into streets (street_name, street_distance) values ('AFD ko''cha', 1);   -- 11
insert into streets (street_name, street_distance) values ('QTR ko''cha', 2);   -- 12
insert into streets (street_name, street_distance) values ('LWT ko''cha', 3);   -- 13
insert into streets (street_name, street_distance) values ('VBT ko''cha', 1);   -- 14
insert into streets (street_name, street_distance) values ('RTY ko''cha', 2);   -- 15


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
insert into areas (area_name, area_distance) values ('alpha hudud', 2);   -- 1
insert into areas (area_name, area_distance) values ('betta hudud', 3);   -- 2
insert into areas (area_name, area_distance) values ('yepoo hudud', 3.5); -- 3
insert into areas (area_name, area_distance) values ('loopp hudud', 4);   -- 4
insert into areas (area_name, area_distance) values ('qwert hudud', 1);   -- 5
insert into areas (area_name, area_distance) values ('tuulp hudud', 4);   -- 6
insert into areas (area_name, area_distance) values ('jeerp hudud', 3);   -- 7
insert into areas (area_name, area_distance) values ('cdert hudud', 2.5); -- 8
insert into areas (area_name, area_distance) values ('zorri hudud', 3);   -- 9
insert into areas (area_name, area_distance) values ('aswed hudud', 1);   -- 10
insert into areas (area_name, area_distance) values ('pooll hudud', 2);   -- 11
insert into areas (area_name, area_distance) values ('tyruu hudud', 1);   -- 12
insert into areas (area_name, area_distance) values ('twerp hudud', 3);   -- 13
insert into areas (area_name, area_distance) values ('keepa hudud', 4);   -- 14
insert into areas (area_name, area_distance) values ('beeen hudud', 2);   -- 15
insert into areas (area_name, area_distance) values ('reety hudud', 3);   -- 16
insert into areas (area_name, area_distance) values ('tesrp hudud', 1);   -- 17
insert into areas (area_name, area_distance) values ('liiia hudud', 2);   -- 18
insert into areas (area_name, area_distance) values ('toole hudud', 2.5); -- 19
insert into areas (area_name, area_distance) values ('veeme hudud', 1.5); -- 20
 

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
('instagram', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7.082c1.602 0 1.792.006 2.425.035 1.627.074 2.385.845 2.46 2.459.028.633.034.822.034 2.424s-.006 1.792-.034 2.424c-.075 1.613-.832 2.386-2.46 2.46-.633.028-.822.035-2.425.035-1.602 0-1.792-.006-2.424-.035-1.63-.075-2.385-.849-2.46-2.46-.028-.632-.035-.822-.035-2.424s.007-1.792.035-2.424c.074-1.615.832-2.386 2.46-2.46.632-.029.822-.034 2.424-.034zm0-1.082c-1.63 0-1.833.007-2.474.037-2.18.1-3.39 1.309-3.49 3.489-.029.641-.036.845-.036 2.474 0 1.63.007 1.834.036 2.474.1 2.179 1.31 3.39 3.49 3.49.641.029.844.036 2.474.036 1.63 0 1.834-.007 2.475-.036 2.176-.1 3.391-1.309 3.489-3.49.029-.64.036-.844.036-2.474 0-1.629-.007-1.833-.036-2.474-.098-2.177-1.309-3.39-3.489-3.489-.641-.03-.845-.037-2.475-.037zm0 2.919c-1.701 0-3.081 1.379-3.081 3.081s1.38 3.081 3.081 3.081 3.081-1.379 3.081-3.081c0-1.701-1.38-3.081-3.081-3.081zm0 5.081c-1.105 0-2-.895-2-2 0-1.104.895-2 2-2 1.104 0 2.001.895 2.001 2s-.897 2-2.001 2zm3.202-5.922c-.397 0-.72.322-.72.72 0 .397.322.72.72.72.398 0 .721-.322.721-.72 0-.398-.322-.72-.721-.72z"/></svg>'),
('facebook', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"/></svg>'),
('telegram', '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="24px" height="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path id="telegram-5" d="M12,0c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12Zm0,2c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10c-5.514,0 -10,-4.486 -10,-10c0,-5.514 4.486,-10 10,-10Zm2.692,14.889c0.161,0.115 0.368,0.143 0.553,0.073c0.185,-0.07 0.322,-0.228 0.362,-0.42c0.435,-2.042 1.489,-7.211 1.884,-9.068c0.03,-0.14 -0.019,-0.285 -0.129,-0.379c-0.11,-0.093 -0.263,-0.12 -0.399,-0.07c-2.096,0.776 -8.553,3.198 -11.192,4.175c-0.168,0.062 -0.277,0.223 -0.271,0.4c0.006,0.177 0.125,0.33 0.296,0.381c1.184,0.354 2.738,0.847 2.738,0.847c0,0 0.725,2.193 1.104,3.308c0.047,0.139 0.157,0.25 0.301,0.287c0.145,0.038 0.298,-0.001 0.406,-0.103c0.608,-0.574 1.548,-1.461 1.548,-1.461c0,0 1.786,1.309 2.799,2.03Zm-5.505,-4.338l0.84,2.769l0.186,-1.754c0,0 3.243,-2.925 5.092,-4.593c0.055,-0.048 0.062,-0.13 0.017,-0.188c-0.045,-0.057 -0.126,-0.071 -0.188,-0.032c-2.143,1.368 -5.947,3.798 -5.947,3.798Z"/></svg>');
