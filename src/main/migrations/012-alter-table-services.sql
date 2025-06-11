ALTER TABLE services DROP CONSTRAINT IF EXISTS prices_type_check;


ALTER TABLE services
    ADD CONSTRAINT services_type_check
        CHECK (type IN (
                        'INDIVIDUAL',
                        'CLOUD',
                        'RACK',
                        'MOVING',
                        'DEPOSIT'
            ));