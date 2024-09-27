import { getServerSession } from "next-auth";
import Header from "../../components/nav/header";
import { redirect } from "next/navigation";
import { db } from "../../lib/prisma";
import BookingItem from "../../components/booking/booking-item";
import { authOptions } from "@/src/lib/auth";
import ServiceItem from "@/src/components/booking/service-item";
import Footer from "@/src/components/nav/footer";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const [service, confirmedBookings, finishedBookings] = await Promise.all([
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
            date: 'asc',
          },
        })
      : [],
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              lt: new Date(),
            },
          },
          include: {
            service: true,
            user: true,
          },
        })
      : [],
  ]);
  
  

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 uppercase font-bold text-sm mb-3">
              Confirmados
            </h2>

            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        {finishedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
              Finalizados
            </h2>

            <div className="flex flex-col gap-3">
              {finishedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default BookingsPage;
