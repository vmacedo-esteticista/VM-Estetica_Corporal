import { getServerSession } from "next-auth";
import Header from "../../components/nav/header";
import { redirect } from "next/navigation";
import { db } from "../../lib/prisma";
import { authOptions } from "@/src/lib/auth";
import ServiceUpload from "@/src/components/user/service_up";
import Footer from "@/src/components/nav/footer";
import { GridAtendimento } from "@/src/components/user/gridAtendimento";

const AdminPage = async () => {
  const allowedEmails = [
    "joadison2219@gmail.com",
    "anavitoriaesteticista@gmail.com",
    "victoriamariald@gmail.com",
    "anavitoria2005gj@gmail.com",
  ];

  const session = await getServerSession(authOptions);
  const user = session?.user;
  const email = user?.email;
  if (!user || typeof email !== "string" || !allowedEmails.includes(email)) {
    return redirect("/");
  }

  const bookings = await db.booking.findMany({
    where: {
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
  });

  const service = await db.service.findMany();

  return (
    <>
      <Header />
      <div className="px-2 py-6">
        <div className="pb-2">
          <ServiceUpload service={service} />
        </div>
        <div className="pb-2 h-auto mx-2">
          <h1>Agendados</h1>
          <GridAtendimento bookings={bookings}/>
          {/* <CalendarioADM bookings={bookings} /> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminPage;
