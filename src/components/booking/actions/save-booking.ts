"use server";

import { db } from "@/src/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import ical from "ical-generator";

interface SaveBookingParams {
  userId: string;
  serviceId: string;
  date: Date;
}

const sendBookingEmailVi = async (user: any, date: Date) => {
  const iCalContent = await createCalendarEvent(date, user.address);
  let transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    },
    secure: true,
  });

  const formattedDate = format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });

  //Formato no E-mail Enviado...
  let mailOptions = {
    from: process.env.USER_MAIL,
    to: user?.email,
    subject: "Confirmação de Agendamento!",
    text: `Olá!\n\nSeu agendamento foi confirmado para ${formattedDate}.\n\nAtenciosamente,\nVM - Estética Corporal`,
    icalEvent: {
      contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
      content: iCalContent,
      method: "request",
    },
  };
  await transporter.sendMail(mailOptions);
};

const createCalendarEvent = (date: Date, location: string) => {
  const calendar = ical({ name: "VM - Estética Corporal" });
  const startTime = date;
  const createEvent = {
    start: startTime,
    summary: "VM - Estética Corporal",
    description: "Massagem",
    location: location,
    url: process.env.URL,
    organizer: {
      name: "VM - Estética Corporal",
      email: process.env.USER_MAIL,
    },
  };
  calendar.createEvent(createEvent);
  const iCalContent = calendar.toString();
  return iCalContent;
};

export const saveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      userId: params.userId,
      serviceId: params.serviceId,
      date: params.date,
    },
  });

  revalidatePath("/");

  const mail = await db.user.findUnique({ where: { id: params.userId } });
  sendBookingEmailVi(mail, params.date);
};
