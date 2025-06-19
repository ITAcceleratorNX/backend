ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;


ALTER TABLE users
    ADD CONSTRAINT users_role_check
        CHECK (users.role IN (
                              'ADMIN', 'USER', 'MANAGER','COURIER'
            ));

ALTER TABLE services DROP CONSTRAINT IF EXISTS services_type_check;


ALTER TABLE services
    ADD CONSTRAINT services_type_check
        CHECK (type IN (
                        'INDIVIDUAL',
                        'CLOUD',
                        'RACK',
                        'LIGHT',
                        'STANDARD',
                        'HARD',
                        'DEPOSIT'
            ));

ALTER TABLE services
ADD COLUMN description TEXT NULL;

