import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import fiscales from "@/models/fiscales";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
        const {numero_fiscal, id_fiscal} = await request.json();
        console.log(numero_fiscal, id_fiscal);
    
}
