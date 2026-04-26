export const COMPARISON_DATA = {
  before: {
    title: "AI-Generated Text",
    content: `Artificial intelligence has revolutionized numerous industries in recent years. It is important to note that machine learning algorithms have become increasingly sophisticated and widely adopted across various sectors. Furthermore, the implementation of AI systems has led to significant improvements in efficiency and productivity metrics.

Organizations are leveraging these technologies to optimize their operations, enhance decision-making processes, and reduce operational costs. In addition, businesses are increasingly relying on data-driven insights to maintain competitive advantages in rapidly evolving markets. `,

    label: "❌ Robotic • Overly Formal • Detectable",
  },

  after: {
    title: "Humanized by Humanly",
    content: `AI's changed a lot in the past few years—and not in a subtle way. Machine learning’s gotten seriously smarter, and it’s showing up everywhere, from small startups to huge companies.

Teams are using it to speed things up, make better decisions, and cut down on busywork. Instead of guessing, they’re working with real insights—and it’s helping them move faster and stay competitive.
`,

    label: "✓ Natural • Conversational • Undetectable",
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
