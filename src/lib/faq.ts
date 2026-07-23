import { prisma } from "@/lib/prisma";
import { isProductionBuildPhase } from "@/lib/build-mode";

const staticFaqs = [
  {
    question: "What is the best time to go on a safari in Tanzania?",
    answer: "The best time for wildlife viewing in Tanzania is during the dry season from June to October. This period offers excellent game viewing as animals gather around water sources. The wildebeest migration in the Serengeti peaks between July and September. However, Tanzania offers great safari experiences year-round, with the green season from November to May offering lush landscapes, fewer crowds, and lower rates.",
    category: "Safari",
    displayOrder: 1,
  },
  {
    question: "Do I need a visa to visit Tanzania?",
    answer: "Most visitors to Tanzania require a visa. You can obtain a visa on arrival at major airports and border crossings, or apply online through the Tanzania eVisa system before your trip. We recommend applying for your eVisa at least two weeks before travel. Visa requirements vary by nationality, so please check with the Tanzanian embassy in your country for specific requirements.",
    category: "Travel",
    displayOrder: 1,
  },
  {
    question: "How do I book a safari with Senza Luce Safaris?",
    answer: "Booking is easy. You can browse our tour packages online, select your preferred safari, and submit an enquiry through our website. Our team will respond within 24 hours with a detailed itinerary and pricing. Alternatively, you can email us directly or call our office. A 30% deposit is required to confirm your booking, with the balance due 60 days before departure.",
    category: "Booking",
    displayOrder: 1,
  },
  {
    question: "What vaccinations do I need for Tanzania?",
    answer: "We recommend consulting your healthcare provider or a travel clinic at least 4-6 weeks before your trip. Commonly recommended vaccinations include Yellow Fever if traveling from an endemic country, Hepatitis A and B, Typhoid, Tetanus, and Polio. Anti-malarial medication is strongly recommended as malaria is present in Tanzania.",
    category: "Health",
    displayOrder: 1,
  },
  {
    question: "What should I pack for a safari?",
    answer: "Pack light, neutral-colored clothing such as khaki, olive, and beige. Avoid bright colors and dark blue, which can attract tsetse flies. Essentials include comfortable walking shoes, warm layers for morning game drives, a sun hat, sunglasses, sunscreen, insect repellent, binoculars, a camera with extra batteries, and a reusable water bottle. Most lodges offer laundry services, so packing for 5-7 days is sufficient.",
    category: "Safari",
    displayOrder: 2,
  },
  {
    question: "Is it safe to travel to Tanzania?",
    answer: "Tanzania is generally a safe destination for tourists. The government prioritizes tourist safety, especially in national parks and popular safari areas. As with any travel destination, we recommend taking standard precautions: keep valuables secure, avoid walking alone at night in cities, and follow your guide's instructions during game drives. Our experienced guides are trained to ensure your safety throughout the safari.",
    category: "Travel",
    displayOrder: 2,
  },
  {
    question: "What types of accommodation are available on safari?",
    answer: "We offer a range of accommodation options to suit every budget and preference: luxury lodges and tented camps with en-suite bathrooms, fine dining, and swimming pools; mid-range lodges offering comfort and authentic safari experiences; and budget camping for adventurous travelers. All accommodations are carefully selected for location, service, and safety standards.",
    category: "Safari",
    displayOrder: 3,
  },
  {
    question: "Can I customize my safari itinerary?",
    answer: "Absolutely. We specialize in creating bespoke safari experiences tailored to your interests, budget, and schedule. Whether you want to extend your stay in a particular park, add cultural experiences, combine wildlife with beach time in Zanzibar, or focus on photography, our team will design the perfect itinerary for you.",
    category: "Booking",
    displayOrder: 2,
  },
  {
    question: "What is the cancellation policy?",
    answer: "Our cancellation policy is designed to be fair: cancellations made 60 or more days before departure receive a full refund minus a processing fee; 30-59 days receive a 50% refund; 15-29 days receive a 25% refund; less than 15 days is non-refundable. We strongly recommend purchasing comprehensive travel insurance that covers trip cancellation, medical emergencies, and evacuation.",
    category: "Booking",
    displayOrder: 3,
  },
  {
    question: "Are your safari vehicles comfortable?",
    answer: "Yes. Our safari vehicles are specially modified 4x4 Land Cruisers with pop-up roofs for excellent game viewing. All vehicles feature comfortable seats, charging ports for your devices, a refrigerator for cold drinks, and a window seat for every passenger. Vehicles are thoroughly cleaned and maintained after every safari.",
    category: "Safari",
    displayOrder: 4,
  },
];

export async function getAllFaqs() {
  if (isProductionBuildPhase()) return staticFaqs;

  try {
    return await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [
        { category: "asc" },
        { displayOrder: "asc" },
      ],
    });
  } catch {
    return staticFaqs;
  }
}

export async function getFaqsByCategory() {
  const faqs = await getAllFaqs();

  const grouped = faqs.reduce<Record<string, Array<{ question: string; answer: string }>>>((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push({
      question: faq.question,
      answer: faq.answer,
    });
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, questions]) => ({
    category,
    questions,
  }));
}
