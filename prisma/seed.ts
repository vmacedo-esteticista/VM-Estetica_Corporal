const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
     const services = [
      {
        name: "Modeladora",
        description: JSON.stringify({
            "1" : "Melhora a circulação sanguínea",
            "2" : "Modelagem do corpo",
            "3" : "Eliminação da retenção de líquidos que provoca inchaço",
            "4" : "Melhora da função intestinal",
        }),
        price: 85.0,
        type:"Massagem",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYL40IslDPmOlUuoPSdz5tpC1cBTk2Jn3y7fNrQ",
      },
      {
        name: "Drenagem Linfática",
        description: JSON.stringify({
            "1" : "Melhora a circulação sanguínea",
            "2" : "Reduz medidas",
            "3" : "Reduz o acúmulo de líquido",
            "4" : "Reduz a sensação de inchaço",
            "5" : "Melhora a celulite"
        }),
        price: 85.0,
        type:"Massagem",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYL2pYP98MCvHw3Zz0NaEckiLjeQDftAoyUIgxS",
      },
      {
        name: "Relaxante",
        description: JSON.stringify({
          "1": "Prevenção e controle do estresse e ansiedade",
          "2": "Disfunções orgânicas",
          "3": "Sono excessivo ou episódios frequentes de insonia",
          "4": "Cansaço ou esgotamento físico",
          "5": "Desmotivação e perda de forças para realizar as atividades cotidianas",
        }),
        price: 85.0,
        type:"Massagem",
        time_service: "01:00:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYLauujm56G6BYZ5QpdnASNHVsOFTCXeqh8uyGj",
      },
      {
        name: "Turbinada",
        description:JSON.stringify({
            "1" : "Favorece a circulação sanguínea",
            "2" : "Melhora a oxigenação das células",
            "3" : "Promove a redução de medidas",
            "4" : "Auxilia o bom funcionamento intestinal",
            "5" : "Elimina toxinas"
        }),
        price: 85.0,
        type:"Massagem",
        time_service: "03:50:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYLmiDWunDJr5TYLxV6GdNwBaDijWA8kovQzsey",
      },
      {
        name: "Vacuoterapia",
        description: JSON.stringify({
            "1" : "Melhora o aspecto da celulite",
            "2" : "Reduz gordura localizada",
            "3" : "Auxilia no combate a flacidez",
            "4" : "Combate à retenção de líquido",
            "5" : "Alívio da dor Muscular",
            "6" : "Aumenta a circulação sanguínea local"
        }),
        price: 100.0,
        type:"Massagem",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYLz4aJulT9ZXAonfG8IYR7k0mQt9iFC65dOwhg",
      },
      {
        name: "Pum UP",
        description: JSON.stringify({
            "1" : "Aumento do volume do glúteos",
            "2" : "Glúteos mais empinados",
            "3" : "Tratamento da celulite",
            "4" : "Aumento da produção de colágeno na região",
            "5" : "Tonificação dos glúteos",
            "6" : "Melhora do fluxo sanguíneo no local",
            "7" : "Promoção de um maior modelagem corporal",
        }),
        price: 100.0,
        type:"Massagem",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYLDh2KG8orZyKcXQMSiwnhTU2rPbzlaLCH5tFI",
      },
      {
        name: "Ventosaterapia",
        description: JSON.stringify({
            "1" : "Fortalece os vasos sanguínea",
            "2" : "Bem estar mental e corporal",
            "3" : "Trata pontos gatilhos",
            "4" : "Aumenta a circulação sanguínea local",
            "5" : "Alivia o stresse",
            "6" : "Alívio da dor muscular",
        }),
        price: 70.0,
        type:"Massagem",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/mUywBsJr5TYLHwn4Mey4py8og025kJixDRW6jVC7FAUTvmLQ",
      },
    ];

    for (const service of services) {
        await prisma.Service.create({
          data: service,
        });
      } 
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao criar:", error);
  }
}

seedDatabase();