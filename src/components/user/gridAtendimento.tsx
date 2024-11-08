"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogClose,
} from "../ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { PhoneIcon } from "lucide-react";
import { FaUber, FaWhatsapp } from "react-icons/fa6";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  createdAt: Date | null;
  user?: any;
}

interface GridAtendimentoProps {
  bookings: Booking[];
}

export function GridAtendimento({ bookings }: GridAtendimentoProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedBooking, setSelectedBooking] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUser = (book: Booking) => {
    const user = book.user || { name: "Usuário não encontrado" };
    setSelectedBooking(user);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "user",
      header: "Cliente",
      cell: ({ row }) => {
        const user = row.getValue("user") as { name: string } | null;
        if (user && user.name) {
          return <div className="capitalize">{user.name}</div>;
        }
      },
    },
    {
      accessorKey: "service",
      header: "Serviço",
      cell: ({ row }) => {
        const service = row.getValue("service") as { name: string } | null;
        if (service && service.name) {
          return <div className="capitalize">{service.name}</div>;
        }
      },
    },
    {
      accessorKey: "date",
      header: "Data e Hora",
      cell: ({ row }) => {
        const date = row.getValue<Date>("date");
        const formattedDate = format(new Date(date), "dd/MM/yyyy HH:mm:ss", {
          locale: ptBR,
        });
        return <div className="text-left  ">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "Ação",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            variant={"secondary"}
            className="capitalize"
            onClick={() => handleUser(row.original)}
          >
            Visualizar
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: bookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const extract = (address: string) => {
    const latMatch = address.match(/lat=(-?\d+(\.\d+)?)/);
    const lonMatch = address.match(/lon=(-?\d+(\.\d+)?)/);
    const lat = latMatch ? parseFloat(latMatch[1]) : undefined;
    const lon = lonMatch ? parseFloat(lonMatch[1]) : undefined;
    const cleanAddress = address
      .replace(/,?\s*lat=-?\d+(\.\d+)?/, "")
      .replace(/,?\s*lon=-?\d+(\.\d+)?/, "")
      .trim();

    return { cleanAddress, lat, lon };
  };

  const getUberUrl = (booking: any) => {
    if (booking && booking.user && booking.user.address) {
      const { cleanAddress, lat, lon } = extract(booking.user.address);

      if (lat !== undefined && lon !== undefined) {
        return `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}&dropoff[nickname]=${cleanAddress}`;
      }
    }
    return "";
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const uberUrl = selectedBooking ? getUberUrl(selectedBooking) : "";

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Usuário</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription className="h-auto text-center my-4 text-black max-h-[60vh] overflow-y-auto">
            {selectedBooking && (
              <div className="flex flex-col text-left gap-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedBooking.image || ''}
                    alt={`${selectedBooking.name}'s profile`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                 <h1 className="text-lg font-semibold">
                    Nome: {selectedBooking.name}
                  </h1>
                </div>
                <h1>
                  Data de Nascimento:{" "}
                  {format(new Date(selectedBooking.date_birth ?? ''), "dd/MM/yyyy")}{" "}
                  Idade: {calculateAge(new Date(selectedBooking.date_birth ?? ''))}
                </h1>
                <Link className="text-blue-700" href={`https://vm-estetica-corporal.vercel.app/user/${selectedBooking.id}`}> Acesse a conta de {selectedBooking.name}</Link>
                <h1>CPF: {selectedBooking.cpf}</h1>
                <h1>E-mail: {selectedBooking.email}</h1>
                <h1>Profissão: {selectedBooking.work}</h1>
                <div className="flex items-center">
                  <h1>Whatsapp: {selectedBooking.telephone}</h1>
                  <Button
                    className="p-0 m-0"
                    variant={"link"}
                    size={"icon"}
                    onClick={() =>
                      window.open(
                        `whatsapp://send?phone=55${selectedBooking.telephone}`,
                        "_blank"
                      )
                    }
                  >
                    <FaWhatsapp size={"20"} />
                  </Button>
                </div>
                <div className="flex items-center">
                  <h1>Ligação: {selectedBooking.telephone}</h1>
                  <Button
                    className="p-0 m-0"
                    variant={"link"}
                    size={"icon"}
                    onClick={() =>
                      window.open(
                        `tel://${selectedBooking.telephone}`,
                        "_blank"
                      )
                    }
                  >
                    <PhoneIcon size={"20"} />
                  </Button>
                </div>
                <div className="flex items-center">
                  <h1>Endereço: {selectedBooking.address}</h1>
                  <Button
                    className="p-0 m-0"
                    variant={"link"}
                    size={"icon"}
                    onClick={() => window.open(uberUrl, "_blank")}
                  >
                    <FaUber size={"20"} />
                  </Button>
                </div>
                <h1>
                  Consumo de Álcool:{" "}
                  {selectedBooking.alcohol_consumption ? "Sim" : "Não"}
                </h1>
                <h1>Histórico Alérgico: {selectedBooking.allergic_history}</h1>
                <h1>
                  Dieta Balanceada:{" "}
                  {selectedBooking.balanced_diet ? "Sim" : "Não"}
                </h1>
                <h1>
                  Método Contraceptivo: {selectedBooking.contraceptive_method}
                </h1>
                <h1>Tipo de Diabetes: {selectedBooking.diabetes_type}</h1>
                <h1>
                  Contato de Emergência: {selectedBooking.emergency_contact}
                </h1>
                <h1>Epilepsia: {selectedBooking.epilepsy ? "Sim" : "Não"}</h1>
                <h1>
                  Duração do Exercício: {selectedBooking.exercise_duration}
                </h1>
                <h1>
                  Possui Filhos:{" "}
                  {selectedBooking.has_children || "Não informado"}
                </h1>
                <h1>
                  Hipertensão: {selectedBooking.hypertension ? "Sim" : "Não"}
                </h1>
                <h1>
                  Hipotensão: {selectedBooking.hypotension ? "Sim" : "Não"}
                </h1>
                <h1>Estado Civil: {selectedBooking.marital_status}</h1>
                <h1>Tratamento Médico: {selectedBooking.medical_treatment}</h1>
                <h1>Ciclo Menstrual: {selectedBooking.menstrual_cycle}</h1>
                <h1>Presença de Metais: {selectedBooking.metal_presence}</h1>
                <h1>
                  Histórico Oncológico: {selectedBooking.oncologic_history}
                </h1>
                <h1>
                  Problemas Ortopédicos: {selectedBooking.orthopedic_issues}
                </h1>
                <h1>
                  Marca-Passo:{" "}
                  {selectedBooking.pacemaker_present ? "Sim" : "Não"}
                </h1>
                <h1>
                  Cosmético Anterior:{" "}
                  {selectedBooking.previous_cosmetic ? "Sim" : "Não"}
                </h1>
                <h1>
                  Função Intestinal Regular:{" "}
                  {selectedBooking.regular_bowel_function ? "Sim" : "Não"}
                </h1>
                <h1>
                  Uso de Ácidos na Pele: {selectedBooking.skin_acids_usage}
                </h1>
                <h1>Histórico Cirúrgico: {selectedBooking.surgical_history}</h1>
                <h1>
                  Consumo de Água:{" "}
                  {selectedBooking.water_consumption ? "Sim" : "Não"}
                </h1>
                <h1>
                  Veias Varicosas:{" "}
                  {selectedBooking.varicose_veins ? "Sim" : "Não"}
                </h1>
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
