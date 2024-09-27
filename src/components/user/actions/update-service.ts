"use server";

import { db } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdadeServiceParams {
    name: string;
    type: string;
    description: string;
    price: number;
    time_service: string;  
}

export const updadeService = async (params: UpdadeServiceParams, id: string) => {
  await db.service.update({
    where: {id},
    data: {
        name: params.name,
        type: params.type,
        description: params.description ,
        price: params.price,
        time_service: params.time_service,
    },
  });

  revalidatePath("/admin");
};
