import { NextResponse } from "next/server";
import supabase from "@/app/libs/supabaseClient";

export async function GET(req) {
  const jwt = require(`jsonwebtoken`);
  const secret = process.env.JWT_SECRET;

  try {
    const authHeader = req.headers.get("authorization");

    let authToken = "";

    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }

    const user = jwt.verify(authToken, secret);

    let { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email);

    if (error) {
      return NextResponse.json(
        { message: "Get users fail maybe wrong data incoming" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: userData }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Get users fail bacause database issue" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    const { email, name, image_url } = body;

    const { data, error } = await supabase
      .from("users")
      .update({ email, name, image_url })
      .eq("email", email)
      .select();

    if (error) {
      return NextResponse.json(
        { message: "Could not update profile because database issue" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Profile update successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Could not update profile because database issue" },
      { status: 500 }
    );
  }
}
