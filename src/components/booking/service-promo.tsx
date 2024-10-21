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
import {
  differenceInMinutes,
  format,
  getDay,
  parse,
  setHours,
  setMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import {
  CalendarSearch,
  CirclePlus,
  Loader,
  LogInIcon,
  UserCircle2,
  UserCog2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { string } from "yup";

interface ServicePromoProps {
  service: Service;
  user: User | null;
}
const ServicePromo = ({ service, user }: ServicePromoProps) => {
  const router = useRouter();
  const { data } = useSession();
  const [serviceid, setServiceId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<string | undefined>();
  const [selections, setSelections] = useState<{ date: Date; hour: string }[]>([]);
  const [overallMaxSessions, setOverallMaxSessions] = useState<number>(0);
  const [subumitIsLoading, setIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const desc = JSON.parse(service.description);

  let descriptions: string[] = [];
  try {
    descriptions = Array.isArray(JSON.parse(service.description))
      ? JSON.parse(service.description)
      : [service.description];
  } catch (error) {
    console.error("Erro ao analisar a descrição do serviço:", error);
  }

  useEffect(() => {
    if (service.id === serviceid) {
      const newMaxSessions: { [key: string]: number } = {};
      for (const description of descriptions) {
        const regex = /(\d+)\s+sessões?\s+de\s+([A-Za-z\s]+)/g;
        let match;
        while ((match = regex.exec(description))) {
          const sessions = parseInt(match[1], 10);
          const serviceType = match[2].trim();
          if (newMaxSessions[serviceType]) {
            newMaxSessions[serviceType] = Math.max(newMaxSessions[serviceType], sessions);
          } else {
            newMaxSessions[serviceType] = sessions;
          }
        }
      }
      const maxSessionsValue = Math.max(...Object.values(newMaxSessions));
      setOverallMaxSessions(maxSessionsValue);
    }
  }, [descriptions, serviceid, service]);

  const handleLoginClick = () => signIn("google");

  useEffect(() => {
    if (!user) {
      return;
    }
    if (
      !user.work ||
      !user.cpf ||
      !user.address ||
      !user.emergency_contact ||
      !user.telephone
    ) {
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

  const handleDateClick = (date: Date) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourCkick = (time: string) => {
    setHour(time);
  };

  const handleAddSelection = () => {
    if (date && hour) {
      const exists = selections.some(
        (selection) => selection.date.toISOString() === date.toISOString()
      );
      
      if (!exists) {
        setSelections((prevSelections) => [
          ...prevSelections,
          { date, hour }
        ]);
      } else {
        toast.error("Esta data já foi selecionada!");
      }
      setDate(undefined);
      setHour(undefined);
    }
  };

  const timeList = useMemo(() => {
    const parsedTime = parse(
      service.time_service ?? "01:00",
      "HH:mm",
      new Date()
    );
    const serviceTime = differenceInMinutes(
      parsedTime,
      setHours(setMinutes(new Date(), 0), 0)
    );
    if (!date) {
      return [];
    }
    const dayOfWeek = getDay(date);
    const generateDayTimeList =
      dayOfWeek === 6
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
      if (!selections.length || selections.length < overallMaxSessions || !data?.user) {
        return;
      }
  
      for (const selection of selections) {
        const dateHour = Number(selection.hour.split(":")[0]);
        const dateMinutes = Number(selection.hour.split(":")[1]);
        const newDate = setMinutes(setHours(selection.date, dateHour), dateMinutes);
  
        await saveBooking({
          serviceId: service.id,
          date: newDate,
          userId: (data?.user as any).id,
        });
  
        toast("Reserva realizada com Sucesso!", {
          description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
            locale: ptBR,
          }),
          action: {
            label: "Visualizar",
            onClick: () => router.push("/bookings"),
          },
        });
      }
  
      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      setSelections([]);
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
            {Object.keys(desc).map((key: string) => (
              <p className="text-[#804c2f]" key={key}>
                <span className="bullet">&bull;</span> {desc[key]}
              </p>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 w-full px-2 py-3">
          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen} modal>
            <SheetTrigger asChild>
              <Button variant={"secondary"} size={"icon"} className="w-full" onClick={() => setServiceId(service.id)}>
                <CalendarSearch className="mr-3" />
                Reservar Promoção
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
                    selected={date}
                    onDayClick={handleDateClick}
                    locale={ptBR}
                    fromDate={new Date()}
                    disabled={{ dayOfWeek: [2, 4] }}
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
                          <h3 className="font-bold">{service.time_service}</h3>
                        </div>

                        {selections.length > 0 && (
                          <>
                            {selections.map((selection, index) => (
                              <div key={index}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm">Data</h3>
                                  <h4 className="text-sm">
                                    {format(selection.date, "dd 'de' MMMM", {
                                      locale: ptBR,
                                    })}
                                  </h4>
                                </div>
                                <div className="flex justify-between">
                                  <h3 className="text-sm">Horário</h3>
                                  <h4 className="text-sm">{selection.hour}</h4>
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        <Button
                          onClick={handleAddSelection}
                          disabled={!date || !hour || selections.length >= overallMaxSessions}
                        >
                          Adicionar Data e Hora <CirclePlus />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="flex justify-center px-5 sm:justify-center">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={selections.length < overallMaxSessions}
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

export default ServicePromo;
