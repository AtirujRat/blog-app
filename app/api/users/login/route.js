import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import supabase from "@/app/libs/supabaseClient";

export async function POST(req) {
  const jwt = require(`jsonwebtoken`);
  try {
    const body = await req.json();
    const { email, password } = body;

    const secret = process.env.JWT_SECRET;

    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (!users[0]) {
      return NextResponse.json(
        { message: "Email or Password is wrong" },
        { status: 401 }
      );
    }

    if (users) {
      const match = await bcrypt.compare(password, users[0].password);

      if (!match) {
        return NextResponse.json(
          { message: "Email or Password is wrong" },
          { status: 401 }
        );
      }
    }
    //create jwt token
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { data: "Login successfully", token: token },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
