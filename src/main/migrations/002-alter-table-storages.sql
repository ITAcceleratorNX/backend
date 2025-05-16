ALTER TABLE storages
    DROP COLUMN length,
    DROP COLUMN width,
    DROP COLUMN available_volume;

CREATE TABLE storage_cells (
                               id SERIAL PRIMARY KEY,
                               storage_id INTEGER NOT NULL REFERENCES storages(id) ON DELETE CASCADE,
                               x INTEGER NOT NULL,
                               y INTEGER NOT NULL,
                               is_occupied BOOLEAN NOT NULL DEFAULT FALSE
);