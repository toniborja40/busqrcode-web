'use client'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio, getKeyValue } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import axios from 'axios'
import { useState, useEffect } from "react";

interface Plantillas_Pizarras_idProps {
    ruta?: any
    params?: any
}


export default function Rutas_id({ ruta, params }: Plantillas_Pizarras_idProps) {

    const router = useRouter()
    const unid = JSON.parse(ruta)
    const rutId = params.rut
    console.log(params.rut)
    const [nombre, setNombre] = useState(unid.nombre)


    useEffect(() => {
        setNombre(unid.nombre);
    }, [unid.nombre]);

    const submitForm = async (e: any) => {
        e.preventDefault();
        const data = {
            nombre,
            id: rutId
        }
        try {
            const response = await axios.put(`/api/rutas`, { ...data, _id: rutId });
            if (response.status === 400) {
                throw new Error('Error al editar la ruta');
            } else if (response.status == 401) {
                toast.error(response.data.error);
                console.log(response)
            } else if (response.status === 409) {
                console.log(response);
                toast.error('No se encuentra ninguna ruta con ese ID');
            } else if (response.status === 200) {
                toast.success('Ruta Editada', {
                    onClose: () => router.push('/rutas')
                });
            }

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }

    const deletePizarra = async () => {
        const deletedPizarra = window.confirm('¿Estás seguro de eliminar la Ruta, esta acción no se puede deshacer')
        if (deletedPizarra) {
            try {
                const response = await axios.delete(`/api/rutas`, { data: { id: rutId } });
                console.log(response)
                if (response.status == 200) {
                    toast.success('ruta eliminada con éxito', { onClose: () => router.push('/rutas') })
                } else if (response.status == 409) {
                    console.log(response)
                    throw new Error('No se encuentra ninguna ruta con ese ID')
                }
            } catch (error) {
                console.log(error)
                toast.error('Error al eliminar la ruta')
            }
        }
        return
    }
    const rows = [
        {
            key: "1",
            name: "Tony Reichert",
            role: "CEO",
            status: "Active",
        },
        {
            key: "2",
            name: "Zoey Lang",
            role: "Technical Lead",
            status: "Paused",
        },
        {
            key: "3",
            name: "Jane Fisher",
            role: "Senior Developer",
            status: "Active",
        },
        {
            key: "4",
            name: "William Howard",
            role: "Community Manager",
            status: "Vacation",
        },
    ];

    const columns = [
        {
            key: "name",
            label: "NAME",
        },
        {
            key: "role",
            label: "ROLE",
        },
        {
            key: "status",
            label: "STATUS",
        },
    ];
    return (
        <>
            <div className="mb-10 rounded-sm border border-stroke bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-col justify-center items-center ">
                    <Card className="my-5 lg:w-1/2">
                        <CardBody className="m-2">
                            <div className="m-5 ">
                                <h1 className="text-xl font-bold">Editar ruta</h1>
                                <Divider />
                                <div className="my-4 w-full">
                                    <form onSubmit={submitForm} className="grid gap-4 pr-3 w-full" >
                                        <Input name="numero" isRequired required type='text' value={nombre} label='Nombre ruta' onChange={(e) => setNombre(e.target.value)} />
                                        <div className="grid grid-cols-2 gap-4 justify-center items-center">
                                            <Button type="submit" variant="shadow" className="w-full bg-green-700 text-slate-100"> Editar ruta</Button>
                                            <Button onClick={() => deletePizarra()} variant="shadow" className="lg:w-full  bg-red-700 text-slate-100">Eliminar ruta</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <div className="flex flex-col gap-3">
                    <Table
                    selectionMode="multiple" 
                    aria-label="Example table with dynamic content">
                        <TableHeader>
                            {columns.map((column) =>
                                <TableColumn key={column.key}>{column.label}</TableColumn>
                            )}
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) =>
                                <TableRow key={row.key}>
                                    {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            </div>
        </>
    )
}