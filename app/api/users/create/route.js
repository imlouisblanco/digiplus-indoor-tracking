import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const revalidate = 0;

const generatePassword = async password => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export async function POST(req) {
  const params = await req.json();
  const { name, password, role, email } = params;

  try {
    const { error } = await supabase.from("users").insert({
      name,
      password: await generatePassword(password),
      role,
      email
    });

    if (error) {
      return NextResponse.json({ message: error.message });
    }

    return NextResponse.json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}
