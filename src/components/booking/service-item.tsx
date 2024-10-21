"use client";

import { signIn, useSession } from "next-auth/react";
import { Booking, Service, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { getDayBookings } from "./actions/get-day-bookings";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { saveBooking } from "@/src/components/booking/actions/save-booking";
import { generateDayTimeListI, generateDayTimeListII } from "@/src/utils/hours";

import { differenceInMinutes, format, getDay, parse, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import {
  CalendarSearch,
  Loader,
  LogInIcon,
  UserCircle2,
  UserCog2Icon,
} from "lucide-react";
import { toast } from "sonner";

interface ServiceItemProps {
  service: Service;
  user: User | null;
}
const ServiceItem = ({ service, user }: ServiceItemProps) => {
  const router = useRouter();
  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<String | undefined>();
  const [subumitIsLoading, setIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const descriptions = JSON.parse(service.description);
  const handleLoginClick = () => signIn("google");
  
  useEffect(() => {
    if(!user){
      return;
    }
    if (!user.work || !user.cpf || !user.address || !user.emergency_contact || !user.telephone) {
      router.push(`/user/${user?.id}`);
    }
  }, [user, router]);

  useEffect(() => {
    if (!date) {
      return;
    }
    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(date);
      setDayBookings(_dayBookings);
    };

    refreshAvailableHours();
  }, [date]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourCkick = (time: string) => {
    setHour(time);
  };

  const timeList = useMemo(() => {
    const parsedTime = parse(service.time_service ?? '01:00', 'HH:mm', new Date());
    const serviceTime = differenceInMinutes(parsedTime, setHours(setMinutes(new Date(), 0), 0));
    if (!date) {
      return [];
    }
    const dayOfWeek = getDay(date);
    const generateDayTimeList = (dayOfWeek === 6)
     ? (date: Date) => generateDayTimeListI(date, serviceTime) 
     : (date: Date) => generateDayTimeListII(date, serviceTime);

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);
      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });
      if (!booking) {
        return true;
      }
      return false;
    });
  }, [date, dayBookings, service]);

  const handleBookingSubmit = async () => {
    setIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }
      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        date: newDate,
        userId: (data?.user as any).id,
      });

      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast("Reserva realizada com Sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const missingData = [];
  if (!user?.telephone) missingData.push("Telefone");
  if (!user?.work) missingData.push("Profissão");
  if (!user?.cpf) missingData.push("CPF");
  if (!user?.address) missingData.push("Endereço");
  if (!user?.emergency_contact) missingData.push("Contato de Emergência");

  return (
    <Card className="my-2 pb-0 boder border-[#d2965d] min-w-[347px] max-w-[347px] h-[auto] rounded-2xl relative">
      <CardContent className="p-0">
        <div className="w-full h-[359px] relative">
          <Image
            src={service.imageUrl ?? ''}
            alt={service.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-2xl"
          />
        </div>
        <div className="flex flex-col justify-between px-3">
          <h2 className="font-bold mt-3">{service.name}</h2>
          <div className="flex-1 text-sm mb-16">
            {Object.keys(descriptions).map((key: string) => (
              <p className="text-[#804c2f]" key={key}>
                <span className="bullet">&bull;</span> {descriptions[key]}
              </p>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 w-full px-2 py-3">
          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen} modal>
            <SheetTrigger asChild>
              <Button variant={"secondary"} size={"icon"} className="w-full">
                <CalendarSearch className="mr-3" />
                Reservar
              </Button>
            </SheetTrigger>

            {data?.user ? (
              missingData.length === 0 ? (
                <SheetContent
                  className="bg-[#f5ede5] px-0 text-center"
                  style={{ maxHeight: "auto", overflowY: "auto" }}
                >
                  <SheetHeader className="px-5 border-b border-solid">
                    <SheetTitle className="text-center">Reservar</SheetTitle>
                  </SheetHeader>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    locale={ptBR}
                    fromDate={new Date()}
                    disabled={{dayOfWeek: [2, 4]}}
                    styles={{
                      months: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "4rem",
                      },
                      head_cell: { width: "100%", textTransform: "capitalize" },
                      cell: { width: "100%" },
                      button: { width: "100%" },
                      nav_button_previous: { width: "32px", height: "32px" },
                      nav_button_next: { width: "32px", height: "32px" },
                      caption: { textTransform: "capitalize" },
                    }}
                  />

                  {date && (
                    <div className="flex overflow-x-auto py-6 p-5 border-t border-solid">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleHourCkick(time)}
                          variant={hour === time ? "default" : "outline"}
                          key={time}
                          className="rounded-full mx-2 hover:bg-[#d59d67] border-none"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 gap-3 flex flex-col">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        <div className="flex justify-between">
                          <h2 className="font-bold">Tempo de Serviço</h2>
                          <h3 className="font-bold">
                            {service.time_service || ''}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-sm">Data</h3>
                            <h4 className="text-sm">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-sm">Horário</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}

                        {/* <div className="flex justify-between">
                        <h3 className="text-sm">Endereço</h3>
                       <h3>{user?.addresses}</h3> 
                      </div>*/}
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="flex justify-center px-5 sm:justify-center">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!hour || !date || subumitIsLoading}
                    >
                      {subumitIsLoading && (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar Reservar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              ) : (
                <SheetContent
                  className="bg-[#f5ede5] px-0 text-center"
                  style={{ maxHeight: "auto", overflowY: "auto" }}
                >
                  <div className="flex flex-col px-5 py-6 gap-3">
                    <h1>
                      Para realizar a Resevar necessitamos de alguns dados
                    </h1>
                  </div>
                  <div className="px-4 py-6 text-left">
                    <p>Dados que estão em falta:</p>
                    {missingData.map((item) => (
                      <p className="" key={item}>
                        <span className="bullet">&bull;</span> {item}
                      </p>
                    ))}
                  </div>

                  <Button
                    variant={"outline"}
                    className="justify-start border-none"
                    onClick={() =>
                      router.push(`/user/${(data.user as any).id}`)
                    }
                  >
                    <UserCog2Icon size={18} className="mr-2" />
                    Configurar Conta
                  </Button>
                </SheetContent>
              )
            ) : (
              <SheetContent
                className="bg-[#f5ede5] px-0 text-center"
                style={{ maxHeight: "auto", overflowY: "auto" }}
              >
                <div className="flex flex-col px-5 py-6 gap-3">
                  <div className="flex items-center gap-3">
                    <UserCircle2 size={38} />
                    <h2 className="font-bold">Olá, faça seu Login!</h2>
                  </div>
                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    className="w-full justify-center hover:bg-[#d59d67]"
                    onClick={handleLoginClick}
                  >
                    <LogInIcon size={18} className="mr-2" />
                    Fazer Login
                  </Button>
                </div>
              </SheetContent>
            )}
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
