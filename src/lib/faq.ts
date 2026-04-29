import { prisma } from '@/lib/prisma';

export async function getAllFaqs() {
  return prisma.fAQ.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { category: 'asc' },
      { displayOrder: 'asc' },
    ],
  });
}

export async function getFaqsByCategory() {
  const faqs = await getAllFaqs();
  
  // Group FAQs by category
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
