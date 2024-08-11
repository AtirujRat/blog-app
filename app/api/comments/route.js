import { NextResponse } from "next/server";
import supabase from "@/app/libs/supabaseClient";

export async function GET(req) {
  try {
    const blogId = req.nextUrl.searchParams.get("blogid");

    let { data: comments, error } = await supabase
      .from("comments")
      .select(
        `*
        , users (name,image_url)
        `
      )
      .eq("blog_id", blogId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: "Could not get comments; maybe wrong data incoming." },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not get comments due to a database issue." },
      { status: 500 }
    );
  }
}

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

    const { user_id, blog_id, comment, image_url_comment } = body;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          user_id,
          blog_id,
          comment,
          image_url_comment,
          created_at: thailandDate.replace(/,/g, ""),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json(
      { data: "Comment has been sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Could not send comments because database issue." },
      { status: 500 }
    );
  }
}
