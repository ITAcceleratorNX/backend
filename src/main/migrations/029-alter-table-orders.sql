ALTER TABLE orders
    ADD COLUMN is_selected_moving BOOLEAN DEFAULT FALSE,
    ADD COLUMN is_selected_package BOOLEAN DEFAULT FALSE;

ALTER TABLE order_services
    ADD COLUMN count INTEGER DEFAULT 1;

ALTER TABLE services DROP CONSTRAINT IF EXISTS services_type_check;

ALTER TABLE services
    ADD CONSTRAINT services_type_check
        CHECK (type IN (
                        'INDIVIDUAL', -- индивидуальное хранение
                        'CLOUD', -- облачное хранение
                        'RACK', -- стеллажное хранение
                        'MOVING', -- услуга переезда
                        'DEPOSIT', -- услуга по хранению
                        'LOADER', -- грузчик
                        'PACKER', -- упаковщик
                        'FURNITURE_SPECIALIST', -- мебельщик
                        'GAZELLE', -- газель
                        'STRETCH_FILM', -- стрейч-пленка
                        'BUBBLE_WRAP', -- воздушно-пузырчатая пленка
                        'BOX_SIZE', -- коробка (размер)
                        'MARKER', -- маркер
                        'UTILITY_KNIFE' -- канцелярский нож
            ));
