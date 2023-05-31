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

    await supabase.from("documents").insert({
        user_id: session.user.id,
        data: body.data
    })

    return json({ message: "Hello World" });
};