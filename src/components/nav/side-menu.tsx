"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import {
  CalendarDaysIcon,
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserCircle2,
  UserCog2Icon,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/src/components/ui/avatar";

const SideMenu = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const handleLogOutClick = () => signOut();
  const handleLoginClick = () => signIn("google");

  const allowedEmails = [
    'joadison2219@gmail.com',
    'anavitoriaesteticista@gmail.com',
    'victoriamariald@gmail.com',
    'anavitoria2005gj@gmail.com'
  ];

  const isAllowedEmail = (email: string | null | undefined): email is string => {
    return typeof email === 'string' && allowedEmails.includes(email);
  };

  return (
    <>
      <SheetContent className="bg-[#f5ede5] px-0">
        <SheetHeader className="px-5 text-center border-b border-solid">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {data?.user ? (
          <div className="flex justify-between items-center px-5 py-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10">
                <AvatarImage src={data.user?.image ?? ""} />
              </Avatar>

              <h2 className="font-bold">{data.user.name}</h2>
            </div>
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={handleLogOutClick}
            >
              {" "}
              <LogOutIcon />{" "}
            </Button>
          </div>
        ) : (
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
        )}

        <div className="flex flex-col gap-3 px-5">
          <Button
            variant={"outline"}
            className="justify-start border-none"
            asChild
          >
            <Link href="/">
              <HomeIcon size={18} className="mr-2" />
              Início
            </Link>
          </Button>

          {data?.user && (
            <>
              <Button
                variant={"outline"}
                className="justify-start border-none"
                onClick={() => router.push(`/user/${(data.user as any).id}`)}
              >
                <UserCog2Icon size={18} className="mr-2" />
                 Configurar Conta
              </Button>

              <Button
                variant={"outline"}
                className="justify-start border-none"
                onClick={() => router.push("/bookings")}
              >
                <CalendarIcon size={18} className="mr-2" />
                Agendamento
              </Button>
              {isAllowedEmail(data.user?.email) && (
                   <Button
                   variant={"outline"}
                   className="justify-start border-none"
                   onClick={() => router.push("/admin")}
                 >
                  <CalendarDaysIcon size={18} className="mr-2"/>
                   Administrador
                 </Button>
               )}
            </>
          )}
        </div>
      </SheetContent>
    </>
  );
};

export default SideMenu;
