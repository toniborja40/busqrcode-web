"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Card,
  CardBody,
  DatePicker,
  Button,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";
import classNames from "classnames";
import { useState } from "react";
import { toast } from "react-toastify";
interface IndexProps {
  horarios?: any;
  rutas?: any;
  fiscales?: any;
  timestamps?: any;
  unidades?: any;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Uso de la función
const todayDate = getTodayDate();
export default function Index({
  horarios,
  rutas,
  fiscales,
  timestamps,
  unidades,
}: IndexProps) {
  const horarios_ = JSON.parse(horarios);
  const rutas_ = JSON.parse(rutas);
  const fiscales_ = JSON.parse(fiscales).sort((a: any, b: any) =>
    a.numero.localeCompare(b.numero)
  );
  const timestamps_ = JSON.parse(timestamps);
  const unidades_ = JSON.parse(unidades).sort(
    (a: any, b: any) => a.numero - b.numero
  );
 
  const [fecha, setFecha] = useState<any>(todayDate);
  const [unidad, setUnidad] = useState<any>(null);
  const [ruta, setRuta] = useState<any>(null);
  const [fiscal, setFiscal] = useState<any>(null);
  const [horario, setHorario] = useState<any>(null);

  console.log(horarios_[0]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const secs = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");
    return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
  };

  //Comparación de datos

  const [fiscalA, setFiscalA] = useState<any>(null);
  const [fiscalB, setFiscalB] = useState<any>(null);
  const [timeCompare, settimeCompare] = useState<any>(null);

  const getTimestamps: any[] = timestamps_.map((timestamp: any) => {
    const ruta = rutas_.filter((r: any) => r._id === timestamp.id_ruta);
    const fiscal = fiscales_.filter((f: any) => f._id === timestamp.id_fiscal);
    const unidad = unidades_.filter((u: any) => u._id === timestamp.id_unidad);
    console.log(unidad);
    return {
      key: timestamp._id,
      hora_servidor: formatDate(timestamp.createdAt),
      hora_telefono: formatDate(timestamp.timestamp_telefono),
      unidad: unidad[0].numero,
      ruta: ruta[0].nombre,
      fiscal: fiscal[0].ubicacion,
    };
  });
  let rows = getTimestamps.filter((timestamp: any) => {
    let registros = timestamp.hora_servidor.includes(fecha);
    return registros;
  });
  if (unidad && ruta) {
    rows = rows.filter(
      (timestamp: any) => timestamp.unidad == unidad && timestamp.ruta === ruta
    );
  } else if (ruta) {
    rows = rows.filter((timestamp: any) => timestamp.ruta === ruta);
  } else if (fiscal) {
    rows = rows.filter((timestamp: any) => timestamp.fiscal === fiscal);
  } else if (unidad) {
    rows = rows.filter((timestamp: any) => timestamp.unidad == unidad);
  }
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
  const resetFilter = () => {
    setUnidad(null);
    setRuta(null);
    setFiscal(null);
    setHorario(null);
    setFiscalA(null)
    setFiscalB(null)
    settimeCompare(null)
  };

  //comparación de datos
  console.log(rows);
  console.log(
    "fiscalA",
    fiscalA,
    "fiscalB",
    fiscalB,
    "timeCompare",
    timeCompare
  );

  
        const fiscalAExists = rows.some((row: any) => row.fiscal === fiscalA);
        const fiscalBExists = rows.some((row: any) => row.fiscal === fiscalB);
       
    if (fiscalAExists && fiscalBExists && timeCompare) {

    
    const getTimestampsA: any[] = rows.map((timestamp: any) => {
      return {
        key: timestamp.key,
        hora_servidor: timestamp.hora_servidor,
        hora_telefono: timestamp.hora_telefono,
        fiscal: timestamp.fiscal,
        ruta: timestamp.ruta,
      };
    });
    let rowsA = getTimestampsA.filter((timestamp: any) => {
      let registros = timestamp.hora_servidor.includes(fecha);
      return registros;
    });
    rowsA = rowsA.filter((timestamp: any) => timestamp.fiscal === fiscalA);
    const getTimestampsB: any[] = rows.map((timestamp: any) => {
      return {
        key: timestamp.key,
        hora_servidor: timestamp.hora_servidor,
        hora_telefono: timestamp.hora_telefono,
        fiscal: timestamp.fiscal,
        ruta: timestamp.ruta,
      };
    });
    let rowsB = getTimestampsB.filter((timestamp: any) => {
      let registros = timestamp.hora_servidor.includes(fecha);
      return registros;
    });
    rowsB = rowsB.filter((timestamp: any) => timestamp.fiscal === fiscalB);

    const compare = (rowsA: any, rowsB: any, timeCompare: any) => {
      let result: {
        onTime: boolean;
        key: any;
        hora_servidorA: any;
        hora_telefonoA: any;
        fiscalA: any;
        hora_servidorB: any;
        hora_telefonoB: any;
        fiscalB: any;
        diff: number;
        delay?: number;
      }[] = [];

      if(fiscalA === fiscalB){
          for (let i = 0; i < rowsA.length-1; i++) {
              const diff = Math.abs(
                  new Date(rowsA[i].hora_servidor).getTime() -
                  new Date(rowsB[i+1].hora_servidor).getTime()
              );
              if (diff >= timeCompare * 60000) {
                  result.push({
                      onTime: true,
                      key: rowsB[i+1].key,
                      hora_servidorA: rowsA[i].hora_servidor,
                      hora_telefonoA: rowsA[i].hora_telefono,
                      fiscalA: rowsA[i].fiscal,
                      hora_servidorB: rowsB[i+1].hora_servidor,
                      hora_telefonoB: rowsB[i+1].hora_telefono,
                      fiscalB: rowsB[i+1].fiscal,
                      diff: diff / 60000,
                  });
              } else {
                  result.push({
                      onTime: false,
                      key: rowsB[i+1].key,
                      hora_servidorA: rowsA[i].hora_servidor,
                      hora_telefonoA: rowsA[i].hora_telefono,
                      fiscalA: rowsA[i].fiscal,
                      hora_servidorB: rowsB[i+1].hora_servidor,
                      hora_telefonoB: rowsB[i+1].hora_telefono,
                      fiscalB: rowsB[i+1].fiscal,
                      diff: diff / 60000,
                      delay: timeCompare - (diff / 60000)
                  });
              }
          }
          return result;
      }else{
          for (let i = 0; i < rowsA.length; i++) {
              const diff = Math.abs(
          new Date(rowsA[i].hora_servidor).getTime() -
            new Date(rowsB[i].hora_servidor).getTime()
        );
        if (diff >= timeCompare * 60000) {
          result.push({
            onTime: true,
            key: rowsB[i].key,
            hora_servidorA: rowsA[i].hora_servidor,
            hora_telefonoA: rowsA[i].hora_telefono,
            fiscalA: rowsA[i].fiscal,
            hora_servidorB: rowsB[i].hora_servidor,
            hora_telefonoB: rowsB[i].hora_telefono,
            fiscalB: rowsB[i].fiscal,
            diff: diff / 60000,
          });
        } else {
          result.push({
            onTime: false,
            key: rowsB[i].key,
            hora_servidorA: rowsA[i].hora_servidor,
            hora_telefonoA: rowsA[i].hora_telefono,
            fiscalA: rowsA[i].fiscal,
            hora_servidorB: rowsB[i].hora_servidor,
            hora_telefonoB: rowsB[i].hora_telefono,
            fiscalB: rowsB[i].fiscal,
            diff: diff / 60000,
            delay: timeCompare - (diff / 60000)
          });
        }
      }
      return result;
        }
    };
    const comparedTimes = compare(rowsA, rowsB, timeCompare);
    console.log(comparedTimes);
    } 

    
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className="text-2xl font-bold">Horarios Fiscales</h1>
        </div>
        <div>
          <Card>
            <CardBody className="p-5 flex flex-wrap flex-row gap-6 justify-center items-center">
              <div>
                <label
                  htmlFor="fecha"
                  className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                >
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="date"
                  value={fecha ? fecha : ""}
                  onChange={(e) => {
                    setFecha(e.target.value);
                    setUnidad(null);
                    setRuta(null);
                    setFiscal(null);
                  }}
                  className="mt-1 block w-full pl-3 pr-2 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="unidad"
                  className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                >
                  Unidad
                </label>
                <select
                  id="unidad"
                  value={unidad ? unidad : ""}
                  onChange={(e) => {
                    setUnidad(e.target.value);
                    setFiscal(null);
                  }}
                  className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Elige una unidad
                  </option>
                  {unidades_.map((unidad: any) => (
                    <option key={unidad._id} value={unidad.numero}>
                      {unidad.numero}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="ruta"
                  className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                >
                  Ruta
                </label>
                <select //hacer un SELECT
                  id="ruta"
                  value={ruta ? ruta : ""}
                  onChange={(e) => {
                    setRuta(e.target.value);
                    setFiscal(null);
                  }}
                  className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Elige una ruta
                  </option>
                  {rutas_.map((unidad: any) => (
                    <option key={unidad._id} value={unidad.nombre}>
                      {unidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="fiscal"
                  className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                >
                  Fiscal
                </label>
                <select //hacer un SELECT
                  id="fiscal"
                  value={fiscal ? fiscal : ""}
                  onChange={(e) => {
                    setFiscal(e.target.value);
                    setUnidad(null);
                    setRuta(null);
                  }}
                  className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Elige un fiscal
                  </option>
                  {fiscales_.map((unidad: any) => (
                    <option key={unidad._id} value={unidad.ubicacion}>
                      {unidad.ubicacion}
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={resetFilter} className="bg-sky-600 font-bold">
                Reset
              </Button>
            </CardBody>
          </Card>
        </div>
        {/* body*/}
        <div className={classNames("grid grid-cols-1 md:grid-cols-3 gap-4")}>
          <div
            className={classNames("flex gap-3", {
              "col-span-2": unidad && ruta,
              "col-span-3": !unidad || !ruta,
            })}
          >
            <Table  aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.key} className={classNames('rounded',{
                    "bg-red-700": item.onTime === false,
                  })}>
                    {(columnKey) => (
                      <TableCell>
                        {/* <Link href={`/registros/${item.key}`}> */}
                        {getKeyValue(item, columnKey)}
                        {/* </Link> */}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {unidad && ruta && (
            <div>
              <div>
                <Card>
                  <div className="flex flex-col m-4 items-center justify-center">
                    <h1 className="font-bold text-lg">Comparación</h1>
                    <Divider />
                  </div>
                  <CardBody className="p-5 flex flex-wrap flex-row gap-6 justify-center items-center">
                    {/* <div>
                                    <label htmlFor="unidadCompare" className="block text-sm font-medium dark:text-slate-100 text-gray-700">Unidad</label>
                                    <select  //hacer un SELECT
                                        id="Compare"
                                        value={unidadCompare ? unidadCompare : ''}
                                        onChange={(e) => {
                                            setUnidadCompare(e.target.value)
                                        }}
                                        className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="" disabled>
                                            Elige una Unidad 
                                        </option>
                                        {unidades_.map((unidad: any) => (
                                            <option key={unidad._id} value={unidad.numero}>
                                                {unidad.numero}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}
                    <div>
                      <label
                        htmlFor="fiscalA"
                        className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                      >
                        Fiscal A
                      </label>
                      <select //hacer un SELECT
                        id="fiscalA"
                        value={fiscalA ? fiscalA : ""}
                        onChange={(e) => {
                          setFiscalA(e.target.value);
                        }}
                        className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="" disabled>
                          Elige un fiscal
                        </option>
                        {fiscales_.map((unidad: any) => (
                          <option key={unidad._id} value={unidad.ubicacion}>
                            {unidad.ubicacion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="fiscalB"
                        className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                      >
                        Fiscal B
                      </label>
                      <select //hacer un SELECT
                        id="fiscalB"
                        value={fiscalB ? fiscalB : ""}
                        onChange={(e) => {
                          setFiscalB(e.target.value);
                        }}
                        className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="" disabled>
                          Elige un fiscal
                        </option>
                        {fiscales_.map((unidad: any) => (
                          <option key={unidad._id} value={unidad.ubicacion}>
                            {unidad.ubicacion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                      >
                        Tiempo de comparación (minutos)
                      </label>
                      <input
                        id="number"
                        type="number"
                        value={timeCompare ? timeCompare : ""}
                        onChange={(e) => {
                          settimeCompare(e.target.value);
                        }}
                        className=" mt-1 block w-full pl-2 pr-2 py-2 text-base border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
