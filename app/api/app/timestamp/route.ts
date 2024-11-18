import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
  const {id_ruta, id_unidad, id_fiscal, timestamp_telefono} = await request.json();
  console.log(id_ruta, id_unidad, id_fiscal, timestamp_telefono);
  try {
    const timestamp = new timestamps({
      id_ruta,
      id_unidad,
      id_fiscal,
      timestamp_telefono,
    });;
    const saveTimestamp = await timestamp.save();
    return NextResponse.json(saveTimestamp);
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
