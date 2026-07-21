const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrator',
      password: hashedPassword,
      role: 'Admin',
    },
  });

  console.log('Seed successful: created admin user:', user.email);

  // Seed Water Level Data
  // const initialData = [
  //   { sensorId: "BND-KTL", location: "Bendungan Katulampa", level: 12.4, status: "Normal", lat: -6.634, lng: 106.837 },
  //   { sensorId: "WDK-JTL", location: "Waduk Jatiluhur", level: 8.9, status: "Warning", lat: -6.535, lng: 107.387 },
  //   { sensorId: "SNG-CLW", location: "Sungai Ciliwung", level: 3.2, status: "Normal", lat: -6.214, lng: 106.845 },
  //   { sensorId: "PTA-MGR", location: "Pintu Air Manggarai", level: 5.5, status: "Critical", lat: -6.208, lng: 106.848 },
  //   { sensorId: "WDK-GJM", location: "Waduk Gajah Mungkur", level: 10.1, status: "Normal", lat: -7.842, lng: 110.899 },
  //   { sensorId: "SNG-BGS", location: "Sungai Bengawan Solo", level: 7.8, status: "Warning", lat: -7.632, lng: 110.835 },
  // ];

  // await prisma.waterlevelData.deleteMany({}); // clear existing
  // for (const data of initialData) {
  //   await prisma.waterlevelData.create({
  //     data,
  //   });
  // }

  // console.log('Seed successful: created waterlevel data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
