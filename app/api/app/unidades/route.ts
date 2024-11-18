import { connectDB } from "@/libs/db";
import unidades from "@/models/unidades";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
    const busId = await request.json()
    console.log(busId.busId)
  try { 
     const rutasList = await unidades.findOne({_id: busId.busId});
    return  NextResponse.json(rutasList);
  } catch (error) {
    console.log(error)
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
