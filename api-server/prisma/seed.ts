import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
    // Example seed data for professions
    await prisma.profession.create({
        data: {
            name: "Potter",
            description:
                "Creates pottery items such as pots, vases, and ceramics.",
        },
    });

    await prisma.profession.create({
        data: {
            name: "Carpenter",
            description:
                "Expert in woodworking, constructing and repairing structures made of wood.",
        },
    });

    await prisma.profession.create({
        data: {
            name: "Painter",
            description:
                "Specializes in applying paint, coatings, and finishes to surfaces.",
        },
    });
    console.log("Seed data inserted.");
}

main()
    .then(() => {
        console.log("Seeding completed successfully.");
        process.exit(0);
    })
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    });
