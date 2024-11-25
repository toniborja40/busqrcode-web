'use client'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Card, CardBody, DatePicker } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
interface IndexProps {
    horarios?: any;
    rutas?:any;
    fiscales?:any
    timestamps?:any
    unidades?:any   
}

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Uso de la función
const todayDate = getTodayDate();
export default function Index( {horarios, rutas, fiscales, timestamps, unidades}: IndexProps){
    const horarios_ = JSON.parse(horarios);
    const rutas_ = JSON.parse(rutas);
    const fiscales_ = JSON.parse(fiscales);
    const timestamps_ = JSON.parse(timestamps);
    const unidades_ = JSON.parse(unidades);
    
    const [fecha, setFecha] = useState<any>(todayDate);
    const [unidad, setUnidad] = useState<any>(null);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const secs = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = String(hours).padStart(2, '0');
        return `${year}-${month}-${day} ${strHours}:${minutes}:${secs} ${ampm}`;
    };


    
    const getTimestamps: any[] = timestamps_.map((timestamp: any) => {
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
    
    console.log(getTimestamps)
    const rows = getTimestamps.filter((timestamp: any) => {
        return timestamp.hora_servidor.includes(fecha)
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
                <div>
                    <Card>
                        <CardBody className='p-5 flex flex-row gap-6'>
                            <div>
                            <label htmlFor="fecha" className="block text-sm font-medium dark:text-slate-100 text-gray-700">Fecha</label>
                            <input
                                id="fecha"
                                type="date"
                                value={fecha ? fecha : ''}
                                onChange={(e) => setFecha(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                                </div>
                                <div>
                            <label htmlFor="unidad" className="block text-sm font-medium dark:text-slate-100 text-gray-700">Unidad</label>
                            <select  //hacer un SELECT
                                id="unidad"
                                value={unidad ? unidad : ''}
                                onChange={(e) => setUnidad(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                <option value="" disabled>
                                    Elige una unidad
                                </option>
                                {unidades_.map((unidad: any) => (
                                    <option key={unidad._id} value={unidad._id}>
                                        {unidad.numero}
                                    </option>
                                ))}
                                </select>
                                </div>
                            <div>
                                <label htmlFor="unidad" className="block text-sm font-medium dark:text-slate-100 text-gray-700">Unidad</label>
                                <select  //hacer un SELECT
                                    id="unidad"
                                    value={unidad ? unidad : ''}
                                    onChange={(e) => setUnidad(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="" disabled>
                                        Elige una ruta
                                    </option>
                                    {rutas_.map((unidad: any) => (
                                        <option key={unidad._id} value={unidad._id}>
                                            {unidad.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="unidad" className="block text-sm font-medium dark:text-slate-100 text-gray-700">Unidad</label>
                                <select  //hacer un SELECT
                                    id="unidad"
                                    value={unidad ? unidad : ''}
                                    onChange={(e) => setUnidad(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="" disabled>
                                        Elige un fiscal
                                    </option>
                                    {fiscales_.map((unidad: any) => (
                                        <option key={unidad._id} value={unidad._id}>
                                            {unidad.numero}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardBody>
                    </Card>
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