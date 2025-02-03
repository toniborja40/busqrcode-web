import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import fiscales from "@/models/fiscales";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
    const {numero_fiscal, id_fiscal} = await request.json();
    console.log(numero_fiscal, id_fiscal);
    try {
        
        return NextResponse.json({ numero_fiscal, id_fiscal }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json((error as Error).message, { status: 400 });
        
    }
}
