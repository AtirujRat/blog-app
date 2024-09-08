import { NextResponse } from "next/server";
import supabase from "@/app/libs/supabaseClient";

export async function GET(req) {
  try {
    let { data: process, error } = await supabase.from("process").select();

    if (error) {
      return NextResponse.json(
        { message: "Could not get blogs maybe wrong data incoming." },
        { status: 400 }
      );
    }

    return NextResponse.json({ process }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Could not get blogs because database issue." },
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

    const { type, name } = body;

    const { data, error } = await supabase
      .from("process")
      .insert([
        {
          type,
          name,
          status: "อยู่ในการดำเนินการ",
          start_time: thailandDate.replace(/,/g, ""),
          finish_time: "ยังไม่เสร็จ",
          updated_at: thailandDate.replace(/,/g, ""),
          created_at: thailandDate.replace(/,/g, ""),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    return NextResponse.json(
      { data: "Record has been created" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Could not create blog because database issue." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required to delete the record." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("process")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: "Could not delete the record." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Record has been successfully deleted" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Could not delete record due to a server error." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
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

    const {
      id,
      type,
      name,
      status,
      start_time,
      finish_time,
      updated_at,
      created_at,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID is required to update the record." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("process")
      .update({
        type,
        name,
        status,
        start_time,
        finish_time,
        updated_at: thailandDate.replace(/,/g, ""),
        created_at,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: "Could not update the record." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Record has been successfully updated" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Could not update record due to a server error." },
      { status: 500 }
    );
  }
}
