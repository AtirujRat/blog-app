import { NextResponse } from "next/server";
import supabase from "@/app/libs/supabaseClient";

export async function GET(req) {
  try {
    let { data: userData, error } = await supabase.from("users").select("*");

    if (error) {
      return NextResponse.json(
        { message: "Could not get users." },
        { status: 400 }
      );
    }

    const getOnlyEmail = userData.map((user) => user.email);

    return NextResponse.json({ data: getOnlyEmail }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Authentication failed." },
      { status: 500 }
    );
  }
}
