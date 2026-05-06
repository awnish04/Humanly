export interface DiscountConfig {
  enabled: boolean;
  discountPercentage: number;
  discountCode: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  showTimer: boolean;
  timerMinutes: number;
  delaySeconds: number;
}

export const discountConfig: DiscountConfig = {
  enabled: true,
  discountPercentage: 25,
  discountCode: "HUMANLY25",
  title: "🎉 Limited Time Offer!",
  description:
    "Transform your AI content into human-like writing with our premium plans",
  ctaText: "Get 20% Off Now",
  ctaLink: "/pricing",
  showTimer: true,
  timerMinutes: 15,
  delaySeconds: 3, // Show popup after 3 seconds
};

// You can easily modify these settings or create different configs for different pages
export const holidayDiscountConfig: DiscountConfig = {
  enabled: false, // Set to true when you want to activate holiday promotions
  discountPercentage: 40,
  discountCode: "HOLIDAY40",
  title: "🎄 Holiday Special!",
  description: "Biggest discount of the year on all Humanly plans",
  ctaText: "Claim Holiday Deal",
  ctaLink: "/pricing",
  showTimer: true,
  timerMinutes: 30,
  delaySeconds: 5,
};
