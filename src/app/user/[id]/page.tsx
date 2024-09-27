import Header from '@/src/components/nav/header';
import Users from '@/src/components/user/users';
import { redirect } from "next/navigation";
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import Footer from '@/src/components/nav/footer';

interface Props {
  params: {
    id: string;
  };
}

const UserPage = async ({ params }: Props) => {
  /* const allowedEmails = [
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
  } */

  const { id } = params;
  const useracss = await db.user.findUnique({ where: { id } });

  if (!useracss) {
    return <p>User not found</p>;
  }

  return (
    <>
      <Header/>
      <Users user={useracss} />
      <Footer />
    </>
  );
};

export default UserPage;