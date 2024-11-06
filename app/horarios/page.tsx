import horarios from "@/models/horarios";
import { connectDB } from "@/libs/db";
import Horarios from "@/components/pages/Horarios";
connectDB()
export default async function Home() {
    const hor = await horarios.find();
    const data = JSON.stringify(hor)

    return (
        <>
            <Horarios horarios={data} />
        </>
    )
}