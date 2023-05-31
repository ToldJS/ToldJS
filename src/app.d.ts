// See https://kit.svelte.dev/docs/types#app

import type { Database } from "$lib/types/db";
import type { SupabaseClient, Session } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errorId: string | undefined;
		}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}

export { };
