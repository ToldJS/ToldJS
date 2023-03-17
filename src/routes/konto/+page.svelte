<script lang="ts">
	import Redirect from '$lib/components/Redirect.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	// create table public.orders (
	// 	id uuid not null primary key default uuid_generate_v4(),
	// 	created_at timestamptz not null default now(),
	// 	user_id uuid not null references auth.users on delete cascade,
	// 	price int8 not null,

	// 	primary key (id)
	// );

	// alter table public.orders enable row level security;

</script>

<svelte:head>
	<title>Konto - ToldJS</title>
</svelte:head>

{#if data.session}
	<p>Velkommen, {data.session.user.email}</p>
{:else}
	<Redirect to="/konto/logind" />
{/if}
