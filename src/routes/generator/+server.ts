import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session) {
        throw error(401);
    }
    const body = await request.json()
    if (!body || !body.data) {
        throw error(400);
    }

    console.log("Inserting data" + session.user.id)
    const { error: supabaseError } = await supabase.from("documents").insert({
        user_id: session.user.id,
        data: body.data
    })
    if (supabaseError) {
        console.log(supabaseError.message);
        throw error(500, { message: supabaseError.message, errorId: supabaseError.code });
    }
    console.log("Data inserted");

    return json({ message: "Hello World" });
};