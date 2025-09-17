import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const revalidate = 0;

export async function POST(req) {
  const params = await req.json();
  const { user, password } = params;

  const { data, error } = await supabase
    .from("users")
    .select(
      `email,
	  name,
	  password`
    )
    .eq("email", user)
    .single();

  console.log(data);

  if (!data) {
    return NextResponse.json({ user: null, status: false });
  }

  const isValidPassword = await bcrypt.compare(password, data.password);
  console.log(isValidPassword);
  return isValidPassword
    ? NextResponse.json({
        user: { name: data.name, email: data.email },
        status: true
      })
    : NextResponse.json({ user: null, status: false });
}
