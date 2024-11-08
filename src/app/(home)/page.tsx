import { db } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import Header from "@/src/components/nav/header";
import ServiceItem from "@/src/components/booking/service-item";
import BookingItem from "@/src/components/booking/booking-item";
import Footer from "@/src/components/nav/footer";
import ServicePromo from "@/src/components/booking/service-promo";
import InstagramPost from "@/src/components/InstagramPost";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user
    ? await db.user.findUnique({ where: { id: (session.user as any).id } })
    : null;

  const [service, confirmedBookings] = await Promise.all([
    db.service.findMany({
      orderBy: {
        id: "asc",
      },
    }),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            user: true,
          },
          orderBy: {
            date: "asc",
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <>
      <Header />
      <div className="px-5 py-5">
        <h2 className="text-xl font-bold">
          {session?.user
            ? `Olá, ${session.user.name?.split(" ")[0]}!`
            : "Olá! Vamos agendar uma massagem hoje ?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="pl-5 text-sm mb-3 uppercase text-gray-500 font-bold">
              Agendamentos
            </h2>
            <div className="mx-2 flex gap-3 overflow-x-auto w-[35rem]">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>

      {service?.filter((service) => service.type === "Promoção").length > 0 && (
        <div className="p-5">
          <h2 className="m-2 text-sm uppercase font-bold">Promoções no Mês</h2>
          <div className="flex gap-2 overflow-x-auto ">
            {service
              .filter((service) => service.type === "Promoção")
              .map((service) => (
                <ServicePromo key={service.id} service={service} user={user} />
              ))}
          </div>
        </div>
      )}

      {service?.filter((service) => service.type === "Massagem").length > 0 && (
        <div className="p-5">
          <h2 className="m-2 text-sm uppercase font-bold">Recomendados</h2>
          <div className="flex gap-2 overflow-x-auto ">
            {service
              .filter((service) => service.type === "Massagem")
              .map((service) => (
                <ServiceItem key={service.id} service={service} user={user} />
              ))}
          </div>
        </div>
      )}

      <div className="m-5 bg-[#D59C66] rounded-lg p-6">
        <h2 className="text-4xl text-white text-center font-bold mb-8">
          Nossos Contatos
        </h2>

        <div className="grid sm:grid-cols-2 justify-between gap-8 bg-[#F6EEE6] p-6 rounded-lg">
          <div className="col-span-1 w-full lg:w-1/2 space-y-4 text-gray-700">
            <p>
              <strong>Telefone:</strong> (55) 85 9 8144-6579
            </p>
            <p>
              <strong>WhatsApp:</strong>{" "}
              <a
                href="whatsapp://send?phone=5585981446579"
                target="_blank"
                className="text-blue-500"
              >
                Clique aqui para conversar no WhatsApp
              </a>
            </p>
            <p>
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:anavitoriaesteticista@gmail.com"
                className="text-blue-500"
              >
                anavitoriaesteticista@gmail.com
              </a>
            </p>
            <p>
              <strong>Endereço:</strong> R. 325, 67a - Nova Metrópole, Caucaia - CE, 61658-630
            </p>
            <p>
              <strong>Horários:</strong>{" "}Seg-Ter-Sex: 14h às 19h <br></br> Sáb: 15h às 19h
            </p>
          </div>
          <div className="col-span-1 w-full mt-4 lg:mt-0">
            <h3 className="text-lg font-semibold mb-2 text-center lg:text-left">
              Localização
            </h3>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d418.47022038228704!2d-38.65438646556514!3d-3.77051867667729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0b36c18e248b9%3A0x54831c66ba7b710d!2sVitoria%20Macedo%20-%20Est%C3%A9tica%20Corporal!5e0!3m2!1spt-BR!2sbr!4v1731076632411!5m2!1spt-BR!2sbr"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
