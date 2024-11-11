import horarios from "@/models/horarios";
import { connectDB } from "@/libs/db";
import Horarios_id from "@/components/pages/Horarios_id";
import rutas from "@/models/rutas";
import fiscales from "@/models/fiscales";
connectDB()
export default async function Home() {
    const rut = await rutas.find();
    const fis = await fiscales.find();
    const hor = await horarios.find();

    return (
        <>
            <Horarios_id rutas={JSON.stringify(rut)} fiscales={JSON.stringify(fis)} />
        </>
    )
}