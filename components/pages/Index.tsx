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
  CardHeader,
} from "@heroui/react";
import classNames from "classnames";
import { useEffect, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';
import { toast } from "react-toastify";
import axios from "axios";
import {ScrollUpIcon}  from "../icons";
import jsPDF from 'jspdf';
interface IndexProps {
  horarios?: any;
  rutas?: any;
  fiscales?: any;
  timestamps?: any;
  unidades?: any;
  payload?:any;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return {fecha:`${year}-${month}-${day}`};
};

// Uso de la función
const todayDate = getTodayDate();



//componente card

interface CustomCardProps {
  columns1: { key: string, label: string }[];
  titulo: string;
  group: any[];
  onDownload: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({ columns1, titulo, group, onDownload }) => {
  return (
    <Card className='relative'>
      <CardHeader>
        <h1 className="font-bold text-lg">{titulo}</h1>
      </CardHeader>
      <Divider />
      <CardBody className='h-72'>
        <Table>
          <TableHeader columns={columns1} aria-label="Tabla">
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={group} aria-label="Tabla">
            {(item) => (
              <TableRow key={(item as any).key} className={classNames('rounded', {
                "bg-red-700": (item as any).onTime === false,
              })}
                aria-label="Tabla">
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
      </CardBody>
    </Card>
  );
};






export default function Index({
  horarios,
  rutas, 
  fiscales,
  timestamps, 
  unidades,
  payload,
}: IndexProps) {
  const horarios_ = JSON.parse(horarios);
  const rutas_ = JSON.parse(rutas);
  const fiscales_ = JSON.parse(fiscales).sort((a: any, b: any) =>
    a.numero.localeCompare(b.numero)
  );
  // const timestamps_ = JSON.parse(timestamps);
  const unidades_ = JSON.parse(unidades).sort(
    (a: any, b: any) => a.numero - b.numero
  );
  const [fecha, setFecha] = useState<any>(todayDate.fecha);
  const [unidad, setUnidad] = useState<any>(null);
  const [ruta, setRuta] = useState<any>(null);
  const [fiscal, setFiscal] = useState<any>(null);
  const [horario, setHorario] = useState<any>(null);
  const [timestamps_, setTimestamps_] = useState<any>([]);
  const [showRows, setShowRows] = useState(false);
  const [showOrden, setShowOrden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mostrarRetardados, setMostrarRetardados] = useState(true)
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/timestamps", { fecha: fecha });
      setTimestamps_(response.data);
    } catch (error) {
      console.log('error', fecha);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [fecha]);

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
    return `${year}-${month}-${day}  ${strHours}:${minutes} ${ampm}`;
  };
  const formatHour = (dateString: string) => {
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
    return `${strHours}:${minutes} ${ampm}`;
  };
  const formatHour30secs = (dateString: string) => {
    const date = new Date(dateString);
    date.setSeconds(date.getSeconds() - 30); // Adelantar 30 segundos jasjsjjadas
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
    return `${strHours}:${minutes} ${ampm}`;
  };
  const compareTimeDifference = (time1: string, time2: string): number => {
    // Función para convertir hora en formato hh:mm AM/PM a objeto Date
    const convertTo24HourFormat = (time: string): Date => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const date1 = convertTo24HourFormat(time1);
    const date2 = convertTo24HourFormat(time2);

    // Calcular la diferencia en minutos
    const diffInMs = Math.abs(date1.getTime() - date2.getTime());
    const diffInMinutes = Math.floor(diffInMs / 60000);

    return diffInMinutes;
  };

  //Comparación de datos

  const [fiscalA, setFiscalA] = useState<any>(null);
  const [fiscalB, setFiscalB] = useState<any>(null);
  const [timeCompare, settimeCompare] = useState<any>(null);

  const getTimestamps: any[] = timestamps_.map((timestamp: any) => {
    const ruta = rutas_.filter((r: any) => r._id === timestamp.id_ruta);
    const fiscal = fiscales_.filter((f: any) => f._id === timestamp.id_fiscal);
    const unidad = unidades_.filter((u: any) => u._id === timestamp.id_unidad);
     if(timestamp.timestamp_salida === null){
       return {
         key: timestamp._id,
         hora_date: formatDate(timestamp.createdAt),
         hora_servidor: formatHour30secs(timestamp.createdAt),
         hora_telefono: formatHour30secs(timestamp.timestamp_telefono),
         unidad: unidad[0].numero,
         ruta: ruta[0].nombre,
         fiscal: fiscal[0].ubicacion,
       };
     }else{
       return {
         key: timestamp._id,
         hora_date: formatDate(timestamp.timestamp_salida),
        //  hora_servidor: formatHour(timestamp.createdAt),
         hora_servidor: formatHour(timestamp.timestamp_salida),
         hora_telefono: formatHour(timestamp.timestamp_telefono),
         unidad: unidad[0].numero,
         ruta: ruta[0].nombre,
         fiscal: fiscal[0].ubicacion,
        };
      }
  
  });
  let rows = getTimestamps.filter((timestamp: any) => {
    let registros = timestamp.hora_date.includes(fecha);
    return registros;
  });

  rows.sort((a: any, b: any) => new Date(a.hora_date).getTime() - new Date(b.hora_date).getTime());

  //filtrado de datos
  let columns1 = [
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
    {
      key: "onTimeText",
      label: "¿A tiempo?",
    },
    {
      key: "diff",
      label: "Diferencia (min)",
    },
    {
      key: "delay",
      label: "Retraso (min)",
    }
  ];
  let columns = [
    {
      key: "hora_servidor",
      label: "Hora",
    },
    // {
    //   key: "hora_telefono",
    //   label: "Hora Teléfono",
    // },
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
  if (ruta && unidad) {
    columns = [
      {
        key: "hora_servidor",
        label: "Hora",
      },
      // {
      //   key: "hora_telefono",
      //   label: "Hora Teléfono",
      // },
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
      {
        key: "onTimeText",
        label: "On Time",
      },
      {
        key: "diff",
        label: "Diferencia (min)",
      },
      {
        key: "delay",
        label: "Retraso (min)",
      }
    ];
    rows = rows.filter((timestamp: any) => timestamp.unidad == unidad && timestamp.ruta === ruta); 
  } else if (ruta) {
    columns = [
      {
        key: "hora_servidor",
        label: "Hora",
      },
      // {
      //   key: "hora_telefono",
      //   label: "Hora Teléfono",
      // },
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
      {
        key: "onTimeText",
        label: "On Time",
      },
      {
        key: "diff",
        label: "Diferencia (min)",
      },
      {
        key: "delay",
        label: "Retraso (min)",
      }
    ];
    rows = rows.filter(
      (timestamp: any) => timestamp.ruta === ruta
    );
  } else if (fiscal) {
    rows = rows.filter((timestamp: any) => timestamp.fiscal === fiscal);
  } else if (unidad) {
    rows = rows.filter((timestamp: any) => timestamp.unidad == unidad);
  }

  //Función para resetear los filtros
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
       

        //seccionar la comparación automáticamente por unidad independientemente de la ruta, definir los tiempos de comparación en minutos en las determinadas sitauciones


    const setTimestamps: any[] = rows.map((timestamp: any) => {
      return {
        key: timestamp.key,
        unidad: timestamp.unidad,
        hora_servidor: timestamp.hora_servidor,
        hora_telefono: timestamp.hora_telefono,
        fiscal: timestamp.fiscal,
        ruta: timestamp.ruta,
      };
    });

    // Lista de todas las unidades que existen en el array de timestamps
    const unidadesordenadas = [...new Set(setTimestamps.map((timestamp: any) => timestamp.unidad))].sort((a, b) => a - b);
    console.log("Unidades ordenadas:", unidadesordenadas);
    // setUnidadesOrdenadas(unidadesordenadas);


    //xd
    // Función para comparar registros
    const compareTimestamps = (timestamps: any[]) => {
      const grouped = timestamps.reduce((acc: any, timestamp: any) => {
        const key = `${timestamp.unidad}-${timestamp.ruta}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(timestamp);
        return acc;
      }, {});

      // Ordenar las claves de los grupos por el número de unidad
      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        const unitA = parseInt(a.split('-')[0], 10);
        const unitB = parseInt(b.split('-')[0], 10);
        return unitA - unitB;
      });
      let sortedRegistros: any[] = []
      sortedKeys.forEach((key) => {
        const group = grouped[key];
        const fiscales = new Set(group.map((timestamp: any) => timestamp.fiscal));
        if (fiscales.size > 1) {
          // Convertir hora_servidor a minutos
          const convertToMinutes = (timeString: string) => {
            const [time, modifier] = timeString.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) {
              hours += 12;
            }
            if (modifier === 'AM' && hours === 12) {
              hours = 0;
            }
            return hours * 60 + minutes;
          };

          // Comparar la posición 0 con la posición 1 solo si el primer fiscal es "Terminal" y el segundo es "Centro"
          
          for (let i = 0; i < group.length - 1; i++) {
            if (group[i].fiscal === "Terminal" && group[i + 1].fiscal === "Centro") {
              const time1 = convertToMinutes(group[i].hora_servidor);
              const time2 = convertToMinutes(group[i + 1].hora_telefono);
              const diff = time2 - time1;
              group[i + 1].onTime = diff <= 23;
              group[i + 1].onTimeText = diff <= 23 ? "A tiempo" : "Retardado";
              group[i + 1].diff = diff;
              group[i + 1].delay = diff > 23 ? diff - 23 : 0;
            }

            if (group[i].fiscal == "Terminal" && group[i + 2]?.fiscal == "3 esquinas"){
              const time1 = convertToMinutes(group[i].hora_servidor);
              const time2 = convertToMinutes(group[i + 2].hora_telefono);
              const diff = time2 - time1;
              group[i + 2].onTime = diff <= 45;
              group[i + 2].onTimeText = diff <= 45 ? "A tiempo" : "Retardado";
              group[i + 2].diff = diff;
              group[i + 2].delay = diff > 45 ? diff - 45 : 0;
            }
            if (group[i].fiscal == 'Barrancas' && group[i + 1]?.fiscal == 'Panaderia') {
              const time1 = convertToMinutes(group[i].hora_servidor);
              const time2 = convertToMinutes(group[i + 1].hora_telefono);
              const diff = time2 - time1;
              const isBefore8am = time1 < 8 * 60; // 8am in minutes
              const threshold = isBefore8am ? 12 : 14;
              group[i + 1].onTime = diff <= threshold;
              group[i + 1].onTimeText = diff <= threshold ? "A tiempo" : "Retardado";
              group[i + 1].diff = diff;
              group[i + 1].delay = diff > threshold ? diff - threshold : 0;
            }
            if (group[i].fiscal == "Terminal" && group[i + 1]?.fiscal == "3 esquinas") {
              const time1 = convertToMinutes(group[i].hora_servidor);
              const time2 = convertToMinutes(group[i + 1].hora_telefono);
              const diff = time2 - time1;
              group[i + 1].onTime = diff <= 45;
              group[i + 1].onTimeText = diff <= 45 ? "A tiempo" : "Retardado";
              group[i + 1].diff = diff;
              group[i + 1].delay = diff > 45 ? diff - 45 : 0;
            }
            if (group[i].fiscal == "Terminal" && group[i + 2]?.fiscal == "Panaderia") {
              const time1 = convertToMinutes(group[i].hora_servidor);
              const time2 = convertToMinutes(group[i + 2].hora_telefono);
              const diff = time2 - time1;
              group[i + 2].onTime = diff <= 47;
              group[i + 2].onTimeText = diff <= 47 ? "A tiempo" : "Retardado";
              group[i + 2].diff = diff;
              group[i + 2].delay = diff > 47 ? diff - 47 : 0;
            }
            if (group[i].fiscal == "Terminal" && group[i + 1]?.fiscal == "Panaderia") {
              const time1 = convertToMinutes(group[i].hora_servidor);
              const time2 = convertToMinutes(group[i + 1].hora_telefono);
              const diff = time2 - time1;
              group[i + 1].onTime = diff <= 47;
              group[i + 1].onTimeText = diff <= 47 ? "A tiempo" : "Retardado";
              group[i + 1].diff = diff;
              group[i + 1].delay = diff > 47 ? diff - 47 : 0;
            }
          }

          const sorted = {
            title: key,
            group,
          }
          sortedRegistros.push(sorted)
        }
        

      });
      return sortedRegistros;
    };

  // Función para filtrar registros retardados
  const getRegistrosRetardados = (registrosOrdenados: any[]): any[] => {
    return registrosOrdenados.filter(registro =>
      registro.group.some((item: any) => item.onTime === false)
    );
  };

    // Llamar a la función de comparación
    const registrosOrdenados = compareTimestamps(setTimestamps);
    console.log(registrosOrdenados);

  // Filtrar registros retardados
  const registrosRetardados = getRegistrosRetardados(registrosOrdenados);
  console.log(registrosRetardados);
    


    //descargar imagenes
  const [selectedRegistro, setSelectedRegistro] = useState<any[]>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);


  const handleDownloadImage = async (index: number, title: string) => {
    const ref = cardRefs.current[index];
    if (ref && hiddenContainerRef.current) {
      // Limpiar el contenedor oculto
      hiddenContainerRef.current.innerHTML = '';
      if (index >= 0 && index < registrosRetardados.length) {
        setSelectedRegistro(registrosRetardados[index]);
      }
      // Extraer los datos de la tabla
      const tableData = ref.outerHTML || '';
      console.log(registrosRetardados[index])
      // Crear un nuevo componente que contenga los datos

      const cardHtml = ReactDOMServer.renderToString(
        <CustomCard
          columns1={columns1}
          titulo={registrosRetardados[index].title}
          group={registrosRetardados[index].group}
          onDownload={() => handleDownloadImage(index, registrosRetardados[index].title)}
        />
      );


      const cardClone = document.createElement('div');
      cardClone.innerHTML = cardHtml;;

      // Aplicar estilos mínimos para asegurar que la tabla se renderice completamente
      cardClone.style.position = 'absolute';
      cardClone.style.top = '0';
      cardClone.style.left = '0';
      cardClone.style.width = 'auto';
      cardClone.style.height = 'auto';
      cardClone.style.overflow = 'visible';
      // Añadir el clon al contenedor oculto
        if (hiddenContainerRef.current) {
          hiddenContainerRef.current.appendChild(cardClone)
        }
      

      // Usar requestAnimationFrame para mejorar el rendimiento
      requestAnimationFrame(async () => {
        const canvas = await html2canvas(cardClone, { useCORS: true });
        const dataUrl = canvas.toDataURL('image/jpeg', 1);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${title} ${fecha}.jpeg`;
        link.click();

        // Limpiar el contenedor oculto
        if (hiddenContainerRef.current) {
          hiddenContainerRef.current.innerHTML = '';
        }
      });
    }
  };
  // recolectar los datos del servidor y hacer de nuevo otro componente en vez de clonar  ----> opción para desarrollar después
  //  Crear un nuevo PDF
  const handleDownloadAllRetardados = async () => {
    if (hiddenContainerRef.current) {
      // Limpiar el contenedor oculto
      hiddenContainerRef.current.innerHTML = '';

      // Crear un contenedor para todos los registros retardados
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = 'auto';
      container.style.height = 'auto';
      container.style.overflow = 'visible';

      // Añadir todos los registros retardados al contenedor
      registrosRetardados.forEach((registro, index) => {
        const cardHtml = ReactDOMServer.renderToString(
          <CustomCard
            columns1={columns1}
            titulo={registro.title}
            group={registro.group}
            onDownload={() => handleDownloadImage(index, registro.title)}
          />
        );

        const cardClone = document.createElement('div');
        cardClone.innerHTML = cardHtml;
        container.appendChild(cardClone);
      });

      // Añadir el contenedor al contenedor oculto
      hiddenContainerRef.current.appendChild(container);

      // Usar requestAnimationFrame para mejorar el rendimiento
      requestAnimationFrame(async () => {
        const pdf = new jsPDF();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        let yOffset = 14;

        pdf.text(`Registros Retardados de ${fecha}`, 10, 10);

        for (let i = 0; i < container.children.length; i++) {
          const cardClone = container.children[i] as HTMLElement;
          const canvas = await html2canvas(cardClone, { useCORS: true });
          const imgData = canvas.toDataURL('image/jpeg');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          if (yOffset + pdfHeight > pageHeight) {
            pdf.addPage();
            yOffset = 10; // Reiniciar el offset en la nueva página
          }

          pdf.addImage(imgData, 'JPEG', 10, yOffset, pdfWidth, pdfHeight);
          yOffset += pdfHeight; // Añadir margen entre imágenes
        }
        pdf.save(`Registros Retardados de ${fecha}.pdf`);

        // Limpiar el contenedor oculto
        if (hiddenContainerRef.current) {
          hiddenContainerRef.current.innerHTML = '';
        }
      });
    }
  };


  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, registrosOrdenados.length);
  }, [registrosOrdenados]);

  return (
    <div>
      <div ref={hiddenContainerRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: 'auto', height: 'auto', overflow: 'hidden' }}></div>
     <section className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className="text-2xl font-bold">Horarios Fiscales</h1>
        </div>
        <div>
          <Card>
            <CardBody className=" p-5 flex flex-wrap flex-row gap-6 justify-center items-center">
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
                  aria-label="Selector de fecha"
                />
              </div>
              <div className='hidden sm:block'>
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
                  aria-label="Selector de unidad"
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
              <div className='hidden sm:block'>
                <label
                  htmlFor="ruta"
                  className="block text-sm font-medium dark:text-slate-100 text-gray-700"
                  aria-label="Selector de ruta"
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
                  aria-label="Selector de ruta"
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
              <div className='hidden sm:block'>
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
                  aria-label="Selector de fiscal"
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
              <div className='flex flex-col sm:flex-row sm:justify-end sm:items-end justify-center items-center gap-4'>
                <Button onPress={resetFilter} className="bg-sky-600 font-bold">
                  Reset
                </Button>
                <Button onPress={() => setShowRows(!showRows)} className="bg-sky-600 font-bold">
                  {showRows ? "Ocultar Lista" : "Mostrar Lista"}
                </Button>

                {todayDate.fecha == fecha ?(
                  <>
                  {loading ? <Button className="bg-sky-600 font-bold cursor-default">
                    Cargando...
                    </Button> : <Button onPress={fetchData} className="bg-sky-600 font-bold">
                  Refrescar registros
                </Button>}
                </>
                ):''}

                <Button onPress={() => setShowOrden(!showOrden)} className="bg-sky-600 font-bold">
                  {showOrden ? "Ocultar Registros Ordenados" : "Mostrar Registros Ordenados"}
                </Button>
                {showOrden ? <Button onPress={() => setMostrarRetardados(!mostrarRetardados)} className="bg-sky-600 font-bold"> {mostrarRetardados ? "Todos los Registros" : "Solo Retardados"}</Button> : ''}
                {showOrden && mostrarRetardados ? <Button onPress={handleDownloadAllRetardados} className = "bg-sky-600 font-bold">Imprimir PDF</Button> : ''}
                {/* <Button onPress={generatePDF} className="bg-sky-600 font-bold">
                 Imprimir Retardados
                </Button> */}
              </div>
            </CardBody>
          </Card>
        </div>
     </section>
     {showOrden && <section className='flex flex-col items-center justify-center gap-4'>
        <h1 className="text-xl font-bold mt-4">Registros ordenados</h1>
        <div className={`p-5 grid grid-cols-1 ${mostrarRetardados ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-4 `}>
          {mostrarRetardados ? registrosRetardados && registrosRetardados.map((registro: any, index: number) => (
            <Card className='relative' key={registro.title} ref={el => { cardRefs.current[index] = el; }}>
                  <CardHeader>
              <Button
                onPress={() => handleDownloadImage(index, registro.title)}
                className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded"
              >
                Descargar
              </Button>
                    <h1 className="font-bold text-lg">{registro.title}</h1>
                  </CardHeader>
                  <Divider/>
                  <CardBody className='h-72'>
                <Table aria-label={`Tabla de ${registro.title}`}>
                  <TableHeader columns={columns1} aria-label="Tabla">
                        {(column) => (
                          <TableColumn key={column.key}>{column.label}</TableColumn>
                        )}
                      </TableHeader>
                  <TableBody items={registro.group} aria-label="Tabla" >
                        {(item) => (
                          <TableRow key={(item as any).key} className={classNames('rounded', {
                            "bg-red-700": (item as any).onTime === false,
                          })}
                        aria-label="Tabla">
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
                  </CardBody>
                </Card>
          )) : registrosOrdenados && registrosOrdenados.map((registro: any, index: number) => (
            <Card className='relative' key={registro.title} ref={el => { cardRefs.current[index] = el; }}>
              <CardHeader>
               {mostrarRetardados && <Button
                  onPress={() => handleDownloadImage(index, registro.title)}
                  className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded"
                >
                  Descargar
                </Button>}
                <h1 className="font-bold text-lg">{registro.title}</h1>
              </CardHeader>
              <Divider />
              <CardBody className='h-72'>
                <Table aria-label={`Tabla de ${registro.title}`}>
                  <TableHeader columns={columns1} aria-label="Tabla">
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={registro.group} aria-label="Tabla" >
                    {(item) => (
                      <TableRow key={(item as any).key} className={classNames('rounded', {
                        "bg-red-700": (item as any).onTime === false,
                      })}
                        aria-label="Tabla">
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
              </CardBody>
            </Card>
          ))}
        </div>
      </section>}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
       
        {/* body*/}
          
          <h1 className="text-xl font-bold ">Registros diarios</h1>
        <div className={classNames("grid grid-cols-1 md:grid-cols-3 gap-4")}>
          <div
            className={classNames("flex gap-3", {
              "col-span-2": ruta,
              "col-span-3": !ruta,
            })}
          >
            <Table  aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={showRows?rows:[]}>
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
          {/* mostrar registros ordenados */}
     
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div>
          <h1 className="text-xl font-bold">Lista de Unidades</h1>
          <div>
            <Card>
                <CardBody className='flex flex-row gap-4'>
                <ul className="flex flex-wrap gap-2">
                      {unidadesordenadas && unidadesordenadas.map((unidad: any) => (
                        <li key={unidad}>{unidad}</li>
                      ))}
                    </ul>
                </CardBody>
            </Card> 
          </div>
        </div>
      </section>
        {!isAtTop && (
      <div className=" fixed bottom-4 right-4 z-50">
        {todayDate.fecha==fecha ?(
          <>
          {loading ? <Button className="bg-red-600 font-bold p-4 rounded-full shadow-lg cursor-default">
            Cargando...
            </Button> :  <Button onPress={fetchData} className="bg-red-600 font-bold p-4 rounded-full shadow-lg">
       Refrescar registros
        </Button>
        }
          </>
            )
        : ''}
          <Button onPress={scrollUp} className="bg-sky-600 font-bold p-4 rounded-full shadow-lg m-4">
            Subir
            <ScrollUpIcon />
          </Button>
      </div>
        )}
    </div>
  );
}
