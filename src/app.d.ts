// See https://kit.svelte.dev/docs/types#app

import type { SupabaseClient, Session } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errorId: string | undefined;
		}
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}

export { };
