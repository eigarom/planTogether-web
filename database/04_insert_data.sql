-- Insertion dans la table 'family' et récupération de l'ID généré
WITH first_insert AS (
    INSERT INTO family (name)
    VALUES ('Kong')
    RETURNING id_family
),
-- Insertion dans la table 'member' en utilisant l'ID de la famille
second_insert AS (
    INSERT INTO member (name, color, id_family)
    SELECT 'Diddy', '#FF0000', id_family
    FROM first_insert
    RETURNING id_member
),
-- Insertion dans la table 'account_member' avec l'ID du membre
third_insert AS (
    INSERT INTO account_member (id_member, email, password_hash, password_salt)
    SELECT
        id_member, 
        'diddy_kong@banana.com', 
        'icIDUHEWCC9YEN22vlZy899NInMVOIYzcZNJzZFTPSYj3tVJRcvEM6Q9nUaLSo/9TD2XVmOJUCRKoot6yKambg==', 
        'L9UMT8Jxj6+u7E2NU4bw1A=='
    FROM second_insert
    RETURNING id_member
),
-- Insertion dans la table 'event' avec l'ID de la famille
fourth_insert AS (
    INSERT INTO event (name, description, color, isVisible, id_family)
    SELECT 'Bibliothèque', 'Rapporter mes deux livres.', '#00FF00', true, id_family 
    FROM first_insert
    RETURNING id_event
)
-- Insertion dans la table 'period' avec l'ID de l'événement
INSERT INTO period (start_date_time, end_date_time, id_event)
SELECT
    '2024-10-09 18:00:00',  -- Date et heure de début (mercredi 9 octobre 2024 à 18h)
    '2024-10-09 18:15:00',  -- Date et heure de fin (mercredi 9 octobre 2024 à 18h15)
    id_event
FROM fourth_insert;
