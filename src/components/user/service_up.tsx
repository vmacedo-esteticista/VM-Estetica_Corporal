"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { Minus, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { UploadButton } from "@/src/utils/uploadthing";
import { Service } from "@prisma/client";
import { createService } from "./actions/create-service";
import { updadeService } from "./actions/update-service";

interface ServiceProps {
  service: Service[];
}

const FormSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  type: yup.string().required(),
  price: yup.string().required(),
  time_service: yup.string(),
});

interface FormValues {
  name: string;
  type: string;
  price: number;
  time_service: string;
}

const ServiceUpload = ({ service }: ServiceProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<any>(FormSchema),
  });
  const [idfile, setIdfile] = useState<string | undefined>();
  const [improvements, setImprovements] = useState<string[]>([]);
  const [newImprovement, setNewImprovement] = useState<string>("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const addImprovement = () => {
    setImprovements([...improvements, newImprovement]);
    setNewImprovement("");
  };

  const remImprovement = (index: number) => {
    const updatedImprovements = [...improvements];
    updatedImprovements.splice(index, 1);
    setImprovements(updatedImprovements);
  };

  const handleServiceSelect = (serviceName: string) => {
    const selectedService = service.find((serv) => serv.name === serviceName);
    setSelectedService(selectedService || null);
  };

  useEffect(() => {
    if (selectedService) {
      setValue("name", selectedService.name);
      setValue("type", selectedService.type);
      setValue("price", Number(selectedService.price.toString()));
      setValue("time_service", selectedService.time_service);
      try {
        const parsedDescription = selectedService.description
          ? JSON.parse(selectedService.description)
          : {};
        const improvementsArray: string[] = Object.values(
          parsedDescription
        ).map((value: any) => String(value));
        setImprovements(improvementsArray);
      } catch (error) {
        console.error("Error parsing description:", error);
        setImprovements([]);
      }
    }
  }, [selectedService, setValue]);

  const onSubmit = async (data: FormValues) => {
    const improvementsObject: { [key: string]: string } = {};
    improvements.forEach((value, index) => {
      improvementsObject[(index + 1).toString()] = value;
    });

    const form = {
      ...data,
      imageUrl: idfile || "",
      description: JSON.stringify(improvementsObject),
      time_service: data.time_service as string
    };
    if (selectedService) {
      await updadeService(form, selectedService.id);
    } else {
      await createService(form);
    }
  };

  return (
    <div className="h-auto mx-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Adicionar Serviços ou Configuração de Serviço
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vh] h-[80vh] sm:max-w-[425px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Adicionar Serviços ou Configuração de Serviço
            </DialogTitle>
            {/* <DialogDescription>Adicionar Serviços</DialogDescription> */}
          </DialogHeader>
          <h1 className="font-bold">Selecione o Serviço que deseja Alterar</h1>
          <div className="flex justify-between items-center gap-2 mb-4">
            <Select onValueChange={handleServiceSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha o serviço" />
              </SelectTrigger>
              <SelectContent>
                {service.map((serv) => (
                  <SelectItem key={serv.id} value={serv.name}>
                    {serv.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService && (
              <Button
                size={"icon"}
                type="button"
                className="p-2 text-white"
                onClick={() => setSelectedService(null)}
              >
                <X />
              </Button>
            )}
          </div>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-2 py-4"
          >
            <div className="grid grid-cols-1 items-center gap-4">
              <h1 className="font-bold">Adicionar Serviços</h1>
              <h2>Adicione a Imagem</h2>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    setIdfile(res[0].url);
                  }
                }}
              ></UploadButton>
              <h2>Texto Principal</h2>
              <Input
                id="name"
                type="text"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}

              <h2>Adicionar informações de melhorias</h2>
              <div className="flex flex-col gap-2">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input type="text" value={improvement} disabled />
                    <Button
                      size={"icon"}
                      type="button"
                      onClick={() => remImprovement(index)}
                    >
                      <Minus />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newImprovement}
                    onChange={(e) => setNewImprovement(e.target.value)}
                  />
                  <Button size={"icon"} type="button" onClick={addImprovement}>
                    <Plus />
                  </Button>
                </div>
              </div>
              <h2>Tipo de Serviço</h2>
              <Input
                id="type"
                type="text"
                {...register("type", { required: true })}
              />
              {errors.type && (
                <p className="error-message">{errors.type.message}</p>
              )}

              <h2>Valor</h2>
              <Input
                id="price"
                type="number"
                {...register("price", { required: true })}
              />
              {errors.price && (
                <p className="error-message">{errors.price.message}</p>
              )}

              <h2>Tempo de Duração</h2>
              <Input
                id="time_service"
                type="time"
                {...register("time_service", { required: true })}
              />
              {errors.time_service && (
                <p className="error-message">{errors.time_service.message}</p>
              )}
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceUpload;
