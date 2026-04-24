DROP PROCEDURE IF EXISTS add_contact_details_to_tickets;

DELIMITER $$

CREATE PROCEDURE add_contact_details_to_tickets()
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'tickets'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = 'tickets'
          AND column_name = 'contact_details'
    ) THEN
        ALTER TABLE tickets
            ADD COLUMN contact_details VARCHAR(255) NOT NULL DEFAULT '';
    END IF;
END$$

DELIMITER ;

CALL add_contact_details_to_tickets();

DROP PROCEDURE IF EXISTS add_contact_details_to_tickets;
