import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const r = await p.letter.deleteMany({
  where: {
    recipientName: {
      in: ["bert", "jhanzie", "jc", "J", "Bert", "Jhanzie", "JC", "zahra", "louis", "Robert"]
    }
  }
});
console.log("Deleted:", r.count);
await p.$disconnect();
