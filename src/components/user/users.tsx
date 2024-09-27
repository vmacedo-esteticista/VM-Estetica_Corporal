"use client";

import * as yup from "yup";
import { useSession } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { updateUser } from "./actions/update-user";
import { isValidCPF } from "@/src/utils/cpf";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  user: User;
}

const FormSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().required().email("E-mail inválido"),
  telephone: yup.string().required("Telefone é obrigatório"),
  date_brith: yup.date().required("Data de Nascimento é obrigatório"),
  marital_status: yup.string().required("Estado civil é obrigatório"),
  cpf: yup.string().test("isValidCPF", "CPF inválido", function (value) {
    return isValidCPF(value);
  }),
  address: yup
    .string()
    .required(
      "Endereço é obrigatório - Preencha assim: Rua 000, casa 00 - Bairro - Cidade - Estado - CEP"
    ),
  emergency_contact: yup.string().required(),
  work: yup.string().required(),
  is_pregnant: yup.boolean(),
  has_children: yup.string(),
  long_sitting: yup.boolean(),
  surgical_history: yup.string(),
  previous_cosmetic: yup.boolean(),
  allergic_history: yup.string(),
  regular_bowel_function: yup.boolean(),
  exercise_duration: yup.string(),
  is_smoker: yup.boolean(),
  alcohol_consumption: yup.boolean(),
  balanced_diet: yup.boolean(),
  water_consumption: yup.boolean(),
  orthopedic_issues: yup.string(),
  medical_treatment: yup.string(),
  skin_acids_usage: yup.string(),
  pacemaker_present: yup.boolean(),
  metal_presence: yup.string(),
  oncologic_history: yup.string(),
  menstrual_cycle: yup.string(),
  contraceptive_method: yup.string(),
  varicose_veins: yup.boolean(),
  lesions_present: yup.boolean(),
  hypertension: yup.boolean(),
  hypotension: yup.boolean(),
  diabetes_type: yup.string(),
  epilepsy: yup.boolean(),
});

interface FormValues {
  name: string;
  email: string;
  telephone: string;
  date_brith: Date;
  marital_status: string;
  cpf: string;
  address: string;
  emergency_contact: string;
  work: string;
  is_pregnant: boolean;
  has_children: string;
  long_sitting: boolean;
  surgical_history: string;
  previous_cosmetic: boolean;
  allergic_history: string;
  regular_bowel_function: boolean;
  exercise_duration: string;
  is_smoker: boolean;
  alcohol_consumption: boolean;
  balanced_diet: boolean;
  water_consumption: boolean;
  orthopedic_issues: string;
  medical_treatment: string;
  skin_acids_usage: string;
  pacemaker_present: boolean;
  metal_presence: string;
  oncologic_history: string;
  menstrual_cycle: string;
  contraceptive_method: string;
  varicose_veins: boolean;
  lesions_present: boolean;
  hypertension: boolean;
  hypotension: boolean;
  diabetes_type: string;
  epilepsy: boolean;
}

const Users = ({ user }: Props) => {
  const { data } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<any>(FormSchema),
    defaultValues: {
      name: user.name || "",
      telephone: user.telephone || "",
      email: user.email || "",
      address: user.address ? user.address.split(", lat=")[0] : "",
      date_brith: user.date_brith ? new Date(user.date_brith) : undefined,
      marital_status: user.marital_status || "",
      work: user.work || "",
      cpf: user.cpf || "",
      emergency_contact: user.emergency_contact || "",
      is_pregnant: user.is_pregnant || false,
      has_children: user.has_children || "",
      long_sitting: user.long_sitting || false,
      surgical_history: user.surgical_history || "",
      previous_cosmetic: user.previous_cosmetic || false,
      allergic_history: user.allergic_history || "",
      regular_bowel_function: user.regular_bowel_function || false,
      exercise_duration: user.exercise_duration || "",
      is_smoker: user.is_smoker || false,
      alcohol_consumption: user.alcohol_consumption || false,
      balanced_diet: user.balanced_diet || false,
      water_consumption: user.water_consumption || false,
      orthopedic_issues: user.orthopedic_issues || "",
      medical_treatment: user.medical_treatment || "",
      skin_acids_usage: user.skin_acids_usage || "",
      pacemaker_present: user.pacemaker_present || false,
      metal_presence: user.metal_presence || "",
      oncologic_history: user.oncologic_history || "",
      menstrual_cycle: user.menstrual_cycle || "",
      contraceptive_method: user.contraceptive_method || "",
      varicose_veins: user.varicose_veins || false,
      lesions_present: user.lesions_present || false,
      hypertension: user.hypertension || false,
      hypotension: user.hypotension || false,
      diabetes_type: user.diabetes_type || "",
      epilepsy: user.epilepsy || false,
    },
  });


  //const address = watch("address");
  //const [selectedPosition, setSelectedPosition] = useState<number[] | null>(null);

  const onSubmit = async (data: FormValues) => {
    await updateUser(user.id, data);
  };

  return (
    <>
      <form
        autoComplete="on"
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto p-6 rounded-lg "
      >
      {/* DADOS de CONTATOS */}
      <div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Nome</h1>
          <Input
            id="name"
            placeholder=""
            {...register("name", { required: true })}
          />
          {errors.name && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Data de Nascimento</h1>
          <Input
            id="date_brith"
            type="date"
            placeholder=""
            {...register("date_brith")}
            value={
              watch("date_brith")
                ? format(new Date(watch("date_brith")), "yyyy-MM-dd")
                : ""
            }
          />
          {errors.date_brith && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">CPF</h1>
          <Input
            id="cpf"
            placeholder="999.9999.999-99"
            {...register("cpf", { required: true })}
          />
          {errors.cpf && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Whatsapp</h1>
          <Input
            id="telefone"
            placeholder="(85) 9 9999 - 9999"
            {...register("telephone", { required: true })}
          />
          {errors.telephone && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Email</h1>
          <Input
            id="email"
            placeholder=""
            {...register("email", { required: true })}
          />
          {errors.email && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Endereço</h1>
          {/* <Map
            address={address}
            onSelectPosition={setSelectedPosition}
            setAddress={(addr: string) => setValue("address", addr)}
          /> */}
          <Input
            id="address"
            placeholder="Rua 000, casa 00 - Bairro - Cidade - Estado - CEP"
            {...register("address")}
            //autoComplete="address-line3"
          />
          {errors.address && <span>{errors.address.message}</span>}
          <p className="text-gray-500">
            Preencha assim: Rua 000, casa 00 - Bairro - Cidade - Estado - CEP
          </p>
        </div>
      </div>
      {/* DADOS Acrecimo */}
      <div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Estado Civil</h1>
          <Select
            onValueChange={(value) => setValue("marital_status", value)}
            defaultValue={user.marital_status || ""}
          >
            <SelectTrigger className="w-[full]">
              <SelectValue placeholder="Escolha o seu estado civil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solteira">Solteira</SelectItem>
              <SelectItem value="Casada">Casada</SelectItem>
              <SelectItem value="Separada Judicialmente">
                Separada Judicialmente
              </SelectItem>
              <SelectItem value="Divorciada">Divorciada</SelectItem>
              <SelectItem value="Viúva">Viúva</SelectItem>
              <SelectItem value="União Estável">União Estável</SelectItem>
            </SelectContent>
          </Select>
          {errors.marital_status && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Profissão</h1>
          <Input
            id="work"
            placeholder=""
            {...register("work", { required: true })}
          />
          {errors.work && <span>Este campo é obrigatório.</span>}
        </div>
        <div className="flex items-center my-4">
          <Input
            id="long_sitting"
            type="checkbox"
            placeholder=""
            {...register("long_sitting", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
           <span className="ml-2 block font-bold">Costuma ficar muito tempo sentada?</span>
        </div>
        <div className="my-4">
          <span className="block font-bold mb-2">A quanto tempo prática atividade física?</span>
          <Input
            id="exercise_duration"
            type="text"
            placeholder="3 meses - 6 meses ou 1 ano - 3 anos ou 4 anos - a mais ou Semanas."
            {...register("exercise_duration", { required: true })}
          />
        </div>
        <div className="my-4">
          <h1 className="block font-bold mb-2">Telefone de Emergência entrar em contato com:</h1>
          <Input
            id="emergency_contact"
            {...register("emergency_contact", { required: true })}
          />
          {errors.emergency_contact && <span>Este campo é obrigatório.</span>}
        </div>
      </div>
      {/* Vida Sexual */}
      <div className="">
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">É gestante?</span>
          <Input
            id="is_pregnant"
            type="checkbox"
            placeholder=""
            {...register("is_pregnant", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="my-4">
          <span className="block font-bold mb-2">Tem filhos?</span>
          <Input
            id="has_children"
            type="text"
            placeholder="Se sim, quantos filhos?"
            {...register("has_children", { required: true })}
          />
        </div>
        <div className="my-4">
          <span className="block font-bold mb-2">Faz algum tratamento médico?</span>
          <Input
            id="medical_treatment"
            type="text"
            placeholder="Se sim, qual tratamento?"
            {...register("medical_treatment", { required: true })}
          />
        </div>
        <div className="my-4">
          <span className="block font-bold mb-2">Usa método anticonceptivo?</span>
          <Input
            id="contraceptive_method"
            type="text"
            placeholder="Se sim, qual anticonceptivo?"
            {...register("contraceptive_method", { required: true })}
          />
        </div>
        <div className="my-4">  
        <span className="block font-bold mb-2">Como é seu ciclo menstrual ? (Duração do período e intensidade das cólicas).</span>
          <Input
            id="menstrual_cycle"
            placeholder=""
            {...register("menstrual_cycle", { required: true })}
          />
        </div>
      </div>
      {/* Vicios */}
      <div className="">
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Realizou tratamento estético anterior?</span>
          <Input
            id="previous_cosmetic"
            type="checkbox"
            {...register("previous_cosmetic", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Ingere água com frequência?</span>
          <Input
            id="water_consumption"
            type="checkbox"
            {...register("water_consumption", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Alimentação balanceada?</span>
          <Input
            id="balanced_diet"
            type="checkbox"
            {...register("balanced_diet", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Ingere bebida alcoólica?</span>
          <Input
            id="alcohol_consumption"
            type="checkbox"
            {...register("alcohol_consumption", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">É fumante?</span>
          <Input
            id="is_smoker"
            type="checkbox"
            {...register("is_smoker", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Funcionamento do intestino regular?</span>
          <Input
            id="regular_bowel_function"
            type="checkbox"
            {...register("regular_bowel_function", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
      </div>
      {/* Doenças */}
      <div>
        <div className="my-4">
          <span className="block font-bold mb-2">Presença de metais?</span>
          <Input
            id="metal_presence"
            type="text"
            placeholder="Se sim, Onde?"
            {...register("metal_presence", { required: true })}
          />
        </div>
        <div className="my-4">
          <span className="block font-bold mb-2">Possui antecedentes cirúrgicos?</span>
          <Input
            id="surgical_history"
            type="text"
            placeholder="Se sim, qual tipo de cirurgia?"
            {...register("surgical_history", { required: true })}
          />
        </div>
        <div className="my-4">
          <span className="block font-bold mb-2">Antecedentes alérgicos?</span>
          <Input
            id="allergic_history"
            type="text"
            placeholder="Diga ao que seria?"
            {...register("allergic_history", { required: true })}
          />
        </div>
        <div className="my-4">  
        <span className="block font-bold mb-2">Tem Diabetes?</span>
          <Input
            id="diabetes_type"
            type="text"
            placeholder="Se sim, qual tipo?"
            {...register("diabetes_type", { required: true })}
          />
        </div>
        <div className="my-4">  
        <span className="block font-bold mb-2">Tem algum problema ortopédico?</span>
          <Input
            id="orthopedic_issues"
            type="text"
            placeholder="Se sim, qual é o problema ortopédico??"
            {...register("orthopedic_issues", { required: true })}
          />
        </div>
        <div className="my-4">  
        <span className="block font-bold mb-2">Usou ou usa ácidos na pele?</span>
          <Input
            id="skin_acids_usage"
            type="text"
            placeholder="Se sim, qual é o tratamento?"
            {...register("skin_acids_usage", { required: true })}
          />
        </div>
        <div className="my-4">  
        <span className="block font-bold mb-2">Antecedentes oncológicos?</span>
          <Input
            id="oncologic_history"
            type="text"
            placeholder="Se sim, qual é o tipo?"
            {...register("oncologic_history", { required: true })}
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Portador de marca-passo?</span>
          <Input
            id="pacemaker_present"
            type="checkbox"
            {...register("pacemaker_present", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Varizes?</span>
          <Input
            id="varicose_veins"
            type="checkbox"
            {...register("varicose_veins", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Lesões?</span>
          <Input
            id="lesions_present"
            type="checkbox"
            {...register("lesions_present", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Hipertensão?</span>
          <Input
            id="hypertension"
            type="checkbox"
            {...register("hypertension", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Hipotensão?</span>
          <Input
            id="hypotension"
            type="checkbox"
            {...register("hypotension", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div className="flex items-center my-4">
          <span className="mr-4 block font-bold">Epilepsia?</span>
          <Input
            id="epilepsy"
            type="checkbox"
            {...register("epilepsy", { required: true })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
      </div>


        <Button type="submit">Enviar</Button>
      </form>
    </>
  );
};

export default Users;
