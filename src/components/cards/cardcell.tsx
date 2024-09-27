"use client"
import { FaInstagram, FaLocationArrow, FaWhatsapp } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

import './style.css'
import Link from "next/link";

const CardCell = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="bg-[#F6EEE6] border-none shadow-none md:flex md:gap-x-[2rem] lg:gap-x-[5rem] xl:gap-x-[10rem] 2xl:gap-x-[15rem] flex-row gap-x-0 mx-auto">
        <CardHeader className="p-0">
          <Image
            src="https://utfs.io/f/e769ac6e-86c8-4e5a-a913-ddb82fd2cfb5-1toc.png"
            width={440}
            height={200}
            alt="logo"
            className="m-0 w-full h-auto "
            />
        </CardHeader>
        <CardContent className="md:grid md:my-auto md:top-[0rem] md:items-end relative text-white top-[-5rem] z-10 gap-y-6 flex flex-col text-center items-center mx-auto">
          <h2 className="md:block hidden text-black text-lg text-center font-glacial">✨ Toques de cuidado, pele macia e sorrisos de transformação. ✨</h2>
        
          <Link className="hovers flex justify-between bg-[#D59C66] md:py-4 py-auto px-6 w-full md:h-auto h-[6rem] rounded-md hover:bg-[#D59C66] fade-in-up" href="https://wa.me/message/LE6IQMCMQZUIA1">
            <p className="sm:flex-1 my-auto mr-6">Fale comigo no <span className="font-bold">WhatsApp</span> agora!</p>
            <FaWhatsapp size={50} className="my-auto"/>
          </Link>

          <Link className="hovers flex justify-between bg-[#D59C66] md:py-4 py-auto px-6 w-full md:h-auto h-[6rem] rounded-md hover:bg-[#D59C66] fade-in-up-delay-1 pulse" href="https://vm-estetica-corporal.vercel.app/">
            <p className="sm:flex-1 my-auto mr-6"><span className="font-bold">Agende</span> seu atendimento agora mesmo!</p>
            <CalendarDays size={50} className="my-auto"/>
          </Link>

          <Link className="hovers flex justify-between bg-[#D59C66] md:py-4 py-auto px-6 w-full md:h-auto h-[6rem] rounded-md hover:bg-[#D59C66] fade-in-up-delay-2" href="https://www.instagram.com/vitoriamacedo.estetic">
            <p className="sm:flex-1 my-auto mr-6">Confira nossas novidades no <span className="font-bold">Instagram</span>!</p>
            <FaInstagram size={50} className="my-auto"/>
          </Link>

          <Link className="hovers flex justify-between bg-[#D59C66] md:py-4 py-auto px-6 w-full md:h-auto h-[6rem] rounded-md hover:bg-[#D59C66] fade-in-up-delay-3" href="https://maps.app.goo.gl/pbizySkQy98sL1xY6"> 
            <p className="sm:flex-1 my-auto mr-6">Venha nos visitar! Veja nossa <span className="font-bold">Localização</span></p>
            <FaLocationArrow size={50} className="my-auto"/>
          </Link>
        </CardContent>
        <CardFooter className="md:hidden flex-col items-center p-0 relative">
        <Image
            src="https://utfs.io/f/83c7c1ab-5e79-416c-9481-5a9f423062da-1zbfv.png"
            width={150}
            height={100}
            alt="logo"
            className="md:hidden m-0"
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardCell;
