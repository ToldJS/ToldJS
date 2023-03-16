import { error, redirect, type Actions } from "@sveltejs/kit";
import { AuthApiError } from "@supabase/supabase-js";

export const actions: Actions = {
    register: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData());

        const { data, error: err } = await locals.supabase.auth.signUp({
            email: body.email as string,
            password: body.password as string,
        });

        if (err) {
            if (err instanceof AuthApiError) {
                throw error(
                    400, 'Ugyldig email eller adgangskode.')
            }
            throw error(
                500, 'Server error. Please try again later')
        }

        throw redirect(303, '/konto/bekræft')
    }
};