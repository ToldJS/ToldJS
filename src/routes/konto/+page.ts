import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";


export const load: PageLoad = async ({ parent }) => {
    const { supabase, session } = await parent();

    if (!session) throw redirect(303, "/konto/logind");

    const { data: tableData } = await supabase.from("orders").select("*");

    return {
        user: session.user,
        orders: tableData,
    };
};