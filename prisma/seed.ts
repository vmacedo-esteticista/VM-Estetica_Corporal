const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
      /* const user1 = await prisma.user.create({
        data: {
          name: "ADM",
          email: "joadison2219@gmail.com",
          telephone: "(85) 9 9999 9999",
          date_brith: new Date("1999-05-28"),
          cpf: "999.999.999-77",
          image: "none",
          password: "SENHA001",
        },
      });
  
      console.log("Usuário inserido com sucesso:", user1);

      const address1 = await prisma.address.create({
        data: {
          userId: user1.id,
          street: "Rua Teste, 3",
          city: "Cidade 1Teste",
          state: "Estado 1Teste",
          country: "País 1Teste",
          cep: "12345-679",
        },
      });
  
      console.log("Endereço inserido com sucesso:", address1);*/
   
     const services = [
      {
        name: "Relaxante",
        description: JSON.stringify({
          "1": "Prevenção e controle do estresse e ansiedade",
          "2": "Disfunções orgânicas",
          "3": "Sono excessivo ou episódios frequentes de insonia",
          "4": "Cansaço ou esgotamento físico",
          "5": "Desmotivação e perda de forças para realizar as atividades cotidianas",
        }),
        price: 60.0,
        type:"Massagem",
        time_service: "01:00:00",
        imageUrl: "https://utfs.io/f/2125104a-80b3-4c65-8f4b-73e92ff8c38b-7xf86y.43.10_7e4f55e2.jpg",
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
        price: 70.0,
        type:"Massagem Circuladoria",
        time_service: "03:50:00",
        imageUrl: "https://utfs.io/f/f7e7e22a-d545-4b9b-869b-d32c98236387-7xf86y.43.10_e5a98729.jpg",
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
        price: 150.0,
        type:"Massagem Circuladoria",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/268117b0-5d97-4d5a-a058-68451b07a938-7xf86y.43.10_c1351395.jpg",
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
        type:"Massagem Circuladoria",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/94677b3d-4402-405d-9365-514a2b889b2d-7xf86y.43.10_57390061.jpg",
      },
      {
        name: "Massagem Modeladora",
        description: JSON.stringify({
            "1" : "Melhora a circulação sanguínea",
            "2" : "Modelagem do corpo",
            "3" : "Eliminação da retenção de líquidos que provoca inchaço",
            "4" : "Melhora da função intestinal",
        }),
        price: 150.0,
        type:"Massagem Circuladoria",
        time_service: "01:50:00",
        imageUrl: "https://utfs.io/f/b1365f79-9fed-4c80-be78-4c6f91f10652-7xf86y.43.10_b517eac5.jpg",
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