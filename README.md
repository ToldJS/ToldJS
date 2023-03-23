[![License: CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
# ToldJS
Website for creating import papers easily.

# Environment Setup
Copy the `.env.example` file to `.env` and fill in the required fields.
Create a table in your database like this: 
```sql
create table public.orders (
		id uuid not null primary key default uuid_generate_v4(),
		created_at timestamptz not null default now(),
		user_id uuid not null references auth.users on delete cascade,
		name text not null
);

alter table public.orders enable row level security;
```
Add the following row level security policy to the table:
```sql
CREATE POLICY "Allow list orders for authenticated user" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id)
```