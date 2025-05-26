ALTER TABLE prices DROP CONSTRAINT IF EXISTS prices_type_check;

ALTER TABLE prices
    ADD CONSTRAINT prices_type_check
        CHECK (type IN ('INDIVIDUAL', 'CLOUD', 'RACK', 'MOVING'));