'use client'
import { Input, Divider, Button, Textarea, TimeInput, Checkbox, Card, CardBody, CardHeader, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Link } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UnidadesProps {
    unidades?: any;
}
export default function Unidades({ unidades}: UnidadesProps) {
    const unidad =  JSON.parse(unidades)

    return (
        <>
            <div className="mb-10 rounded-sm border border-stroke bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="m-5">
                    <div className="grid grid-cols-3 my-4 gap-4">
                        {unidad.map((unidad: any, index: any) => {
                          
                            return (

                                <Card key={unidad._id} className="max-w-[300px]">
                                    <CardHeader className="flex gap-3">
                                        <div className="flex flex-col">
                                            <Link href={`/unidades/${unidad._id}`} className="text-md">Unidad {unidad.numero}</Link>
                                        </div>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <p><b>Conductor:</b> {unidad.nombre_conductor}</p>
                                    </CardBody>
                                    <Divider />
                                </Card>

                            )
                        })}
                    </div>
                    <div className="pt-4">
                        <Link href="/unidades/add">
                            <Button variant='shadow' className={`bg-green-700 text-slate-100`}>Agregar Unidad</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}