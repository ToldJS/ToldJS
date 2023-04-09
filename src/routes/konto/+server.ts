import { error, json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({
    locals: { supabase, getSession }
}) => {
    const session = await getSession();
    if (!session) {
        throw error(401);
    }

    const { error: requestError } = await supabase.auth.admin.deleteUser(session.user.id);
    if (requestError) {
        return json({
            message: requestError.message
        })
    }
    return json({
        message: "Din konto er nu slettet."
    })
}