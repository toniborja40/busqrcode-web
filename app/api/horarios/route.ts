import { connectDB } from "@/libs/db";
import rutas from "@/models/rutas";
import { NextResponse } from "next/server";
import horarios from "@/models/horarios";

connectDB();

export async function POST(request: any) {
  const { nombre, horas, ruta_id } = await request.json();

  try {
    const findHorario = await horarios.findOne({ nombre });
    if (findHorario) {
      return NextResponse.json(
        { error: "Ya existe un horario con ese nombre" },
        { status: 401 }
      );
    }
    const newHorario = new horarios({
      nombre, horas, ruta_id
    });
    const savedUnidad = await newHorario.save();
    return NextResponse.json(savedUnidad);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

export async function PUT(request: any) {
  const { nombre, fiscales, _id } = await request.json();
  console.log(nombre, fiscales);
  try {
    const findNumero = await rutas.findOne({ nombre });
    if (findNumero && findNumero._id.toString() != _id) {
      return NextResponse.json(
        { error: "Ya existe un fiscal con este número" },
        { status: 401 }
      );
    }
    const updatedUnidad = await rutas.findOneAndUpdate(
      { _id },
      { nombre, fiscales }
    );
    if (!updatedUnidad) {
      return NextResponse.json(
        { error: "No se encuentra ningún fiscal con ese ID" },
        { status: 409 }
      );
    }
    return NextResponse.json(updatedUnidad);
  } catch (error) {
    console.log;
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}

export async function DELETE(request: any) {
  const { id } = await request.json();
  console.log(id);
  try {
    const deletedUnidad = await rutas.findByIdAndDelete(id);
    if (!deletedUnidad) {
      return NextResponse.json(
        { error: "No se encuentra ninguna unidad con ese ID" },
        { status: 409 }
      );
    }
    return NextResponse.json(deletedUnidad);
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
