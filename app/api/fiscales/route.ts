import { connectDB } from "@/libs/db";
import fiscales from "@/models/fiscales";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: any) {
  const { ubicacion, numero, username, password } =
    await request.json();

  try {
    const findUnidad = await fiscales.findOne({ numero });
    if (findUnidad) {
      return NextResponse.json(
        { error: "Ya existe una unidad con esta placa" },
        { status: 401 }
      );
    }
    const findUsername = await fiscales.findOne({ username})
    if (findUsername) {
      return NextResponse.json(
        { error: "Ya existe un fiscal con este nombre de usuario" },
        { status: 401 }
      );
    }
    const newUnidad = new fiscales({
      ubicacion,
      numero,
      username,
      password
    });
    const savedUnidad = await newUnidad.save();
    return NextResponse.json(savedUnidad);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

export async function PUT(request: any) {
  const { ubicacion, numero, _id, username, password } = await request.json();
  console.log(ubicacion, numero, _id, username, password);
  try {
    const findNumero = await fiscales.findOne({ numero });
    console.log(findNumero._id.toString(), _id);
    if (findNumero && findNumero._id.toString() != _id) {
      return NextResponse.json(
        { error: "Ya existe un fiscal con este número" },
        { status: 401 }
      );
    }
    const findUsername = await fiscales.findOne({ username });
    if (findUsername && findUsername._id.toString() != _id) {
      return NextResponse.json(
        { error: "Ya existe un fiscal con este nombre de usuario" },
        { status: 401 }
      );
    }
    const updatedUnidad = await fiscales.findOneAndUpdate(
      { _id },
      { ubicacion, numero, password, username },
    );
    if (!updatedUnidad) {
      return NextResponse.json(
        { error: "No se encuentra ningún fiscal con ese ID" },
        { status: 409 }
      );
    }
    return NextResponse.json(updatedUnidad);
  } catch (error) {
    console.log
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

export async function DELETE(request: any) {
  const { id } = await request.json();
  console.log(id);
  try {
    const deletedUnidad = await fiscales.findByIdAndDelete(id);
    if (!deletedUnidad) {
      return NextResponse.json(
        { error: "No se encuentra ninguna unidad con ese ID" },
        { status: 409 }
      );
    }
    return NextResponse.json(deletedUnidad);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
