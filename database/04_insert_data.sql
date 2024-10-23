-- Insertion des familles (si la famille est la même, tu peux la réutiliser)
WITH first_insert AS (
    INSERT INTO family (name, color)
    VALUES ('Kong', '#FF8000')
    RETURNING id_family
),

-- Insertion de 'Diddy' dans la table 'member' et récupération de l'ID du membre
second_insert AS (
    INSERT INTO member (name, color, id_family)
    SELECT 'Diddy', '#FF0000', id_family FROM first_insert
    RETURNING id_member
),

-- Insertion dans la table 'account_member' pour 'Diddy'
third_insert AS (
    INSERT INTO account_member (id_member, email, password_hash)
    SELECT id_member, 'diddy_kong@banana.com', 
        '$2a$10$42/27sPyWj/38c2cnJ1iyu7U14Yh5gTA/lylT1r5Hr9LMddXQGFZO'  
    FROM second_insert
    RETURNING id_member
),

-- Insertion de l'événement pour 'Diddy'
fourth_insert AS (
    INSERT INTO event (name, description, color, isVisible, id_family)
    SELECT 'Bibliothèque', 'Rapporter mes deux livres.', '#00FF00', true, id_family FROM first_insert
    RETURNING id_event
),

-- Insertion de la période pour l'événement de 'Diddy'
fifth_insert AS (
    INSERT INTO period (start_date_time, end_date_time, id_event)
    SELECT '2024-10-23 18:00:00', '2024-10-23 18:15:00', id_event
    FROM fourth_insert
    RETURNING id_event
),

-- Insertion dans 'Participation' pour 'Diddy'
participation_diddy AS (
    INSERT INTO Participation (id_member, id_event)
    SELECT id_member, id_event
    FROM second_insert, fourth_insert
),

-- Insertion de 'Dixie' dans la table 'member'
dixie_member AS (
    INSERT INTO member (name, color, id_family)
    SELECT 'Dixie', '#00FF00', id_family FROM first_insert
    RETURNING id_member
),

-- Insertion dans la table 'account_member' pour 'Dixie'
dixie_account AS (
    INSERT INTO account_member (id_member, email, password_hash)
    SELECT id_member, 'dixie_kong@banana.com', 
        '$2a$10$42/27sPyWj/38c2cnJ1iyu7U14Yh5gTA/lylT1r5Hr9LMddXQGFZO'
    FROM dixie_member
    RETURNING id_member
),

-- Insertion de l'événement pour 'Dixie'
dixie_event AS (
    INSERT INTO event (name, description, color, isVisible, id_family)
    SELECT 'Concert', 'Aller au concert du soir.', '#FFD700', false, id_family FROM first_insert
    RETURNING id_event
),

-- Insertion de la période pour l'événement de 'Dixie'
dixie_period AS (
    INSERT INTO period (start_date_time, end_date_time, id_event)
    SELECT '2024-10-23 20:00:00', '2024-10-23 22:00:00', id_event
    FROM dixie_event
    RETURNING id_event
)

-- Insertion dans 'Participation' pour 'Dixie'
INSERT INTO Participation (id_member, id_event)
SELECT id_member, id_event
FROM dixie_member, dixie_event;
