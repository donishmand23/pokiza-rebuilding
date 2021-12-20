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
