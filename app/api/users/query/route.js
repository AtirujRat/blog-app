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

    let { data: userData_google, error_google } = await supabase
      .from("users(login with google)")
      .select("*")
      .eq("email", user.email);

    if (error) {
      return NextResponse.json(
        { message: "authentication fail" },
        { status: 400 }
      );
    }

    if (!userData[0]) {
      console.log(1);
      return NextResponse.json({ data: userData_google }, { status: 200 });
    } else {
      console.log(2);
      return NextResponse.json({ data: userData }, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}
