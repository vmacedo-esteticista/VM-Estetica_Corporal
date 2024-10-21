"use client";

import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Prisma } from "@prisma/client";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import { cancelBooking } from "../booking/actions/cancel-booking";
import { toast } from "sonner";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      user: true;
    };
  }>;
}



const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const descriptions = JSON.parse(booking?.service.description);
  const isBookingConfirmed = isFuture(booking.date);
  const { service } = booking;

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);

    try {
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full mb-2">
          <CardContent className="flex py-0 px-0">
            <div className="flex flex-col gap-2 py-5 flex-[3] pl-6">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold mx-1">{service.name}</h2>
              <div className="flex items-center gap-2 my-2">
                <Image
                  src={service.imageUrl ?? ''}
                  width={95}
                  height={22}
                  alt="VM - Estética Corporal"
                  className="border rounded-[10%]"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 border-l border-solid border-secondary">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="px-0">
        <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="p-0">
          <div className="flex justify-center">
            <Badge
              variant={isBookingConfirmed ? "default" : "secondary"}
              className="w-fit my-3 p-3"
            >
              {isBookingConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
          </div>

          <div className="flex-1 text-bold mb-16 mx-5">
            {Object.keys(descriptions).map((key: string) => (
              <p key={key}>
                <span className="bullet">&bull;</span> {descriptions[key]}
              </p>
            ))}
          </div>

          <div className="text-center border-t pt-5">
            <h1 className="font-bold">
              <Button
                className="p-0 m-0"
                variant={"link"}
                size={"icon"}
                onClick={() =>
                  window.open(`whatsapp://send?phone=5585981446579`, "_blank")
                }
              >
                Whatsapp - 85 9 8144-6579
              </Button>
            </h1>
            <h1 className="font-bold">Telefone - 85 9 8144-6579</h1>
          </div>

          <SheetFooter className="flex-row gap-3 mt-6 pt-5 mx-5">
            <SheetClose asChild>
              <Button className="w-full" variant="secondary">
                Voltar
              </Button>
            </SheetClose>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!isBookingConfirmed || isDeleteLoading}
                  className="w-full"
                  variant="destructive"
                >
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Deseja mesmo cancelar essa reserva?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Uma vez cancelada, não será possível reverter essa ação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3">
                  <AlertDialogCancel className="w-full mt-0">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleteLoading}
                    className="w-full"
                    onClick={handleCancelClick}
                  >
                    {isDeleteLoading && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
