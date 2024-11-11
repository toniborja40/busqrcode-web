"use client";
import {
    Input, Divider, Button, Textarea, TimeInput, Checkbox, Card, CardBody, CardHeader, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Link, Select, SelectItem,
} from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

interface UnidadesProps {
    rutas?: any;
    fiscales?: any;
    horarios?:any;
}

export default function Horarios_id({ rutas, fiscales, horarios }: UnidadesProps) {

    return(
        <>
        ola
        </>
    )
}