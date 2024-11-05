import rutas from "@/models/rutas";
import { connectDB } from "@/libs/db";
import { ObjectId } from "mongodb";
import Rutas_id from "@/components/pages/Rutas_id";

connectDB()

export default async function Home(props: { params: Promise<{ rut: any }> }) {
    const param = await props.params;
    const grupId = await param.rut
    if (!ObjectId.isValid(grupId)) {
        return
    }
    const unidad = await rutas.findOne({ _id: grupId });
    console.log(unidad)
    return (
        <>
            <Rutas_id ruta={JSON.stringify(unidad)} params={param} />
        </>
    )
}