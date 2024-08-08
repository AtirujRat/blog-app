import { NextResponse } from "next/server";
import supabase from "@/app/libs/supabaseClient";

export async function POST(req) {
  const jwt = require(`jsonwebtoken`);
  try {
    const body = await req.json();
    const { email, name, image_url } = body;
    const secret = process.env.JWT_SECRET;

    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1h",
    });

    let { data: users } = await supabase
      .from("users(login with google)")
      .select("*")
      .eq("email", email);

    if (users[0]) {
      return NextResponse.json(
        { data: "Login successfully", token: token },
        { status: 200 }
      );
    } else {
      await supabase
        .from("users(login with google)")
        .insert([{ email, name, image_url }])
        .select();

      return NextResponse.json(
        { data: "Login successfully", token: token },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
