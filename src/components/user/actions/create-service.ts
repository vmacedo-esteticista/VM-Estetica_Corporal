"use server";

import { db } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateServiceParams {
    name: string;
    imageUrl: string;
    type: string;
    description: string;
    price: number;
    time_service: string;  
}

export const createService = async (params: CreateServiceParams) => {
  await db.service.create({
    data: {
        name: params.name,
        imageUrl: params.imageUrl,
        type: params.type,
        description: params.description ,
        price: params.price,
        time_service: params.time_service,
    },
  });

  revalidatePath("/admin");
};
