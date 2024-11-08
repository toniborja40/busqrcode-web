'use client'
import { Input, Divider, Button, Textarea, TimeInput, Checkbox, Card, CardBody, CardHeader, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Link, Select, SelectItem } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import bcrypt from 'bcryptjs';

interface UnidadesProps {
    rutas?: any;
    fiscales?: any;
}

export default function Unidades_add({ rutas, fiscales }: UnidadesProps) {
    const router = useRouter();
    const rut = JSON.parse(rutas);
    const fis = JSON.parse(fiscales);
    console.log(rut);
    console.log(fis)
    const [selectedRuta, setSelectedRuta] = useState("");
    const [selectedFiscal, setSelectedFiscal] = useState("");

    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log("Selected Ruta:", selectedRuta);
        console.log("Selected Fiscal:", selectedFiscal);
        // Handle form submission logic here
    };
    if(selectedRuta){
       const ruta = rut.filter((ruta:any) => ruta._id === selectedRuta);
       const fiscId = ruta[0].fiscales.map((fis:any) => fis.fiscal_id);
       const fiscRuta = fis.filter((fis:any) => fiscId.includes(fis._id)).sort((a:any, b:any) => a.numero - b.numero);
       console.log(fiscRuta)

    }
    
    return (
        <>
            <div className="mb-10 rounded-sm border border-stroke bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center m-10">
                    <Card className="my-5 w-full">
                        <CardBody className="m-2">
                            <div className="m-5 ">
                                <h1 className="text-xl font-bold">Agregar Horario</h1>
                                <Divider />
                                <div className="my-4 w-full">
                                    <form onSubmit={handleSubmit} className=" pr-3 w-full gap-4">
                                        <div className="flex flex-cols gap-4 m-3">
                                            <div>
                                                <label htmlFor="ruta" className="block text-sm font-medium text-gray-700">Seleccionar Ruta</label>
                                                <select
                                                    id="ruta"
                                                    name="ruta"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={selectedRuta}
                                                    onChange={(e) => setSelectedRuta(e.target.value)}
                                                >
                                                    <option value="" disabled>Elige una ruta</option>
                                                    {rut.map((ruta:any) => (
                                                        <option key={ruta._id} value={ruta._id}>
                                                            {ruta.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedRuta ? <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 m-3'>
                                            
                                        </div> : ''}
                                      
                                        <div className="flex pt-4 ">
                                        <Button type="submit" variant="shadow" className="w-1/2 bg-green-700 text-slate-100 ">Agregar Horario</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    )
}