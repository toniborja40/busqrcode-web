"use client";

import { Button, Card, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";

interface HorariosProps {
  horarios?: any;
  rutas?:any;
  fiscales?:any
}

export default function Horarios({ horarios, rutas }: HorariosProps) {
  const ruta = JSON.parse(rutas);
  const horario = JSON.parse(horarios);

  return(
  <>
      <div className="mb-10 rounded-sm border border-stroke bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col justify-center items-center m-4">
          <h1 className="text-2xl font-bold ">Horarios</h1>
          <div className="grid grid-cols-3 my-4 gap-4">
            {horario.map((horario: any, index: any) => {
              return (
                <Card key={horario._id} className="max-w-[300px]">
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <Link
                        href={`/horarios/${horario._id}`}
                        className="text-md">
                        horario {horario.nombre}
                      </Link>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>
                      <b>Ruta:</b> 
                    </p>
                  </CardBody>
                  <Divider />
                </Card>
              );
            })}
          </div>
          <div className="pt-4">
            <Link href="/horarios/add">
              <Button
                variant="shadow"
                className={`bg-green-700 text-slate-100`}
              >
                Agregar horario
              </Button>
            </Link>
          </div>
        </div>
      </div>
  </>);
}
