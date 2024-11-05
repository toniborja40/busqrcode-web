'use client'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button, Input, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import axios from 'axios'
import { useState } from "react";
import bcrypt from 'bcryptjs';

interface Plantillas_Pizarras_idProps {
    ruta?: any
    params?: any
}

export default function Rutas_id({ ruta, params }: Plantillas_Pizarras_idProps) {
    const router = useRouter()
    const unid = JSON.parse(ruta)
    const rutId = params.rut
    console.log(params.fisc)
    const [nombre, setNombre] = useState(unid.nombre)

    const submitForm = async (e: any) => {
        e.preventDefault();
        const data = {
            nombre,
            id: rutId
        }
        try {
            const response = await axios.put(`/api/ruta`, { ...data, _id: params.rut });
            if (response.status === 400) {
                throw new Error('Error al editar la ruta');
            } else if (response.status == 401) {
                toast.error(response.data.error);
                console.log(response)
            } else if (response.status === 409) {
                console.log(response);
                toast.error('No se encuentra ninguna ruta con ese ID');
            } else if (response.status === 200) {
                toast.success('Unidad Editada', {
                    onClose: () => router.push('/ruta')
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
                const response = await axios.delete(`/api/ruta`, { data: { id: params.rut } });
                console.log(response)
                if (response.status == 200) {
                    toast.success('ruta eliminada con éxito', { onClose: () => router.push('/ruta') })
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
    return (
        <>
            <div className="mb-10 rounded-sm border border-stroke bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center ">
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
                </div>
            </div>
        </>
    )
}
