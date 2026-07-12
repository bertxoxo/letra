import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const letters = [
    {
      slug: "our-random-drives",
      title: "Our random drives",
      message: "our random drives pas ujan still live in my mind rent free",
      category: "Friendship",
      recipientName: "clara",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "someday-ill-be-brave",
      title: "Someday",
      message: "i hope someday i'll be brave enough to tell u how much u meant to me",
      category: "Heartbreak",
      recipientName: "axel",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "everything-reminds-me",
      title: "Everything reminds me",
      message: "everything reminds me of u, even that warteg tempat kita first hangout",
      category: "Missing Someone",
      recipientName: "lyra",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "how-your-smile",
      title: "Your smile",
      message: "masih inget how your smile made everything feel okay, i miss that feeling",
      category: "Love",
      recipientName: "tara",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "our-random-drives-2",
      title: "Last conversation",
      message: "i keep replaying that last conversation we had, wishing i said something different",
      category: "Regret",
      recipientName: "marco",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "someday-ill-be-brave-2",
      title: "Enough",
      message: "you were the first person who made me feel like i was enough just as i am",
      category: "Gratitude",
      recipientName: "ines",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "everything-reminds-me-2",
      title: "Deleted photos",
      message: "i deleted our photos but somehow i still see you everywhere i go",
      category: "Heartbreak",
      recipientName: "sam",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "how-your-smile-2",
      title: "Rainy afternoon",
      message: "some days i wish i could go back to that rainy afternoon, just to sit next to you again",
      category: "Missing Someone",
      recipientName: "reina",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
    {
      slug: "our-random-drives-3",
      title: "Thank you for staying",
      message: "thank you for staying when everyone else walked away. i never said it enough",
      category: "Friendship",
      recipientName: "theo",
      senderEmail: "seed@letra.local",
      publishType: "PUBLISH_ONLY" as const,
    },
  ];

  for (const letter of letters) {
    await prisma.letter.upsert({
      where: { slug: letter.slug },
      update: {},
      create: letter,
    });
  }

  console.log(`Seeded ${letters.length} letters.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });