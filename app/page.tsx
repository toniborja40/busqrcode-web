import Index from "@/components/pages/Index";
import { connectDB } from "@/libs/db";
import timestamps from "@/models/timestamps";
import rutas from "@/models/rutas";
import horarios from "@/models/horarios";
import unidades from "@/models/unidades";
import fiscales from "@/models/fiscales";
export default async function Home() {
  connectDB();
  const timestamp = await timestamps.find();
  const ruta = await rutas.find()
  const horario = await horarios.find()
  const unidad = await unidades.find()
  const fiscal = await fiscales.find()
  console.log(timestamp);
  return (
    <Index timestamps={JSON.stringify(timestamp)} horarios={JSON.stringify(horario)} rutas={JSON.stringify(ruta)}  unidades={JSON.stringify(unidad)} fiscales={JSON.stringify(fiscal)} />
  );
}
