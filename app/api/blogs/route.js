import { NextResponse } from "next/server";
import supabase from "@/app/libs/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();

    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    };

    const thailandDate = new Date().toLocaleDateString("en-US", options);

    const { user_id, topic, description, image_url } = body;

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          user_id,
          topic,
          description,
          image_url,
          created_at: thailandDate.replace(/,/g, ""),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { message: "Could not create blog." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Create blog successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Could not create blog because database issue." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    let { data: blogs, error } = await supabase
      .from("blogs")
      .select(
        `*
        , users (name,image_url)
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: "Could not get blogs maybe wrong data incoming." },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Could not get blogs because database issue." },
      { status: 500 }
    );
  }
}
