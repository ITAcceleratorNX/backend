alter table notifications drop constraint notifications_user_id_fkey;

alter table notifications alter column user_id drop default;

alter table notifications alter column user_id set not null;

alter table notifications add constraint notifications_user_id_fkey foreign key (user_id) references users on delete cascade;

alter table chats drop constraint unique_user_id;

alter table chats add constraint unique_user_id unique (user_id);

alter table chats add constraint chats_user_id_fkey foreign key (user_id) references users on delete cascade;

alter table messages
    add constraint messages_sender_id_fkey
        foreign key (sender_id) references users(id) on delete cascade;
alter table orders drop constraint orders_user_id_fkey;

alter table orders add constraint orders_user_id_fkey foreign key (user_id) references users on delete cascade;
