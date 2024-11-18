'use client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import Link from "next/link";

interface IndexProps {
    horarios?: any;
    rutas?:any;
    fiscales?:any
    timestamps?:any
    unidades?:any   
}

export default function Index( {horarios, rutas, fiscales, timestamps, unidades}: IndexProps){
    const horarios_ = JSON.parse(horarios);
    const rutas_ = JSON.parse(rutas);
    const fiscales_ = JSON.parse(fiscales);
    const timestamps_ = JSON.parse(timestamps);
    const unidades_ = JSON.parse(unidades);
   
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const secs = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${secs}`;
    };
    const rows: Iterable<any> | undefined = timestamps_.map((timestamp: any) => {
        const ruta = rutas_.filter((r:any) => r._id === timestamp.id_ruta)
        const fiscal = fiscales_.filter((f:any) => f._id === timestamp.id_fiscal)
        const unidad = unidades_.filter((u:any) => u._id === timestamp.id_unidad)
        return {
            key: timestamp._id,
            hora_servidor: formatDate(timestamp.createdAt),
            hora_telefono: formatDate(timestamp.timestamp_telefono),
            unidad: unidad[0].numero,
            ruta: ruta[0].nombre,
            fiscal: fiscal[0].username
        }
    })

    console.log(rows)

    const columns = [
        {
            key: "hora_servidor",
            label: "Hora Servidor",
        },
        {
            key: "hora_telefono",
            label: "Hora Teléfono",
        },
        {
            key: "unidad",
            label: "Unidad",
        },
        {
            key: "ruta",
            label: "Ruta",
        },
        {
            key: "fiscal",
            label: "Fiscal",
        },
    ];
    return(
        <>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-xl text-center justify-center">
                    <h1 className="text-2xl font-bold">Horarios Fiscales</h1>
                </div>
                <div className="flex gap-3">
                    <Table aria-label="Example table with dynamic content">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={rows}>
                            {(item) => (
                                <TableRow key={item.key}>
                                    {(columnKey) => <TableCell>
                                        {/* <Link href='/'> */}
                                            {getKeyValue(item, columnKey)}
                                               {/* </Link> */}
                                            </TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-8">

                </div>
            </section>
        </>
    )
}