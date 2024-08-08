import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import supabase from "@/app/libs/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, name, password } = body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name, password: hashedPassword }])
      .select();

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Registration successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
