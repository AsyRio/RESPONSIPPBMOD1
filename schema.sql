create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  phone text
);

create table books (
  id uuid primary key default gen_random_uuid(),
  isbn text unique,
  title text not null,
  author text,
  stock integer default 1
);

create table loans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  loan_date date not null default current_date,
  due_date date not null,
  return_date date,
  status text not null default 'Dipinjam'
    check (status in ('Dipinjam', 'Dikembalikan', 'Terlambat'))
);

-- Modul 1 memakai anon key, jadi RLS dimatikan agar API dapat membaca/menulis.
alter table members disable row level security;
alter table books disable row level security;
alter table loans disable row level security;
grant all on members, books, loans to anon, authenticated;
