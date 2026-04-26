export const COMPARISON_DATA = {
  before: {
    title: "AI-Generated Text",
    content: `Artificial intelligence has revolutionized numerous industries in recent years. It is important to note that machine learning algorithms have become increasingly sophisticated. Furthermore, the implementation of AI systems has led to significant improvements in efficiency and productivity. Organizations are leveraging these technologies to optimize their operations. In conclusion, AI represents a transformative force in modern business.`,
    label: "❌ Robotic & Detectable",
  },
  after: {
    title: "Humanized by Humanly",
    content: `AI's changed everything lately. Machine learning's gotten way smarter, and companies are seeing real results—better efficiency, smoother workflows, the works. Businesses everywhere are jumping on board, using these tools to get ahead. Bottom line? AI's reshaping how we work.`,
    label: "✓ Natural & Undetectable",
  },
};

// Generate data URLs for the comparison images
export function generateComparisonImages() {
  // This will be rendered on the client side
  return {
    beforeImage: "/api/placeholder/800/600", // Placeholder - will be replaced with actual rendering
    afterImage: "/api/placeholder/800/600",
  };
}
