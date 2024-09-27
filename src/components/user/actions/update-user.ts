"use server";

import { db } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export const updateUser = async(userId: string, data: any) => {
    const now = new Date();
    await db.user.update({
        where: {id: userId},
        data :{
            ...data,
            updatedAt: now,
        },
    });

    redirect("/");
}