import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const cookieStore = await cookies();
    const res = NextResponse.json({ ok: true });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
        return NextResponse.json({ ok: false, error: error?.message ?? "Unauthorized" }, { status: 401 });
    }
    return res;
}