# Global Components

This directory contains components that appear on all pages of the application.

## Go to Top Button

A floating button that appears when the user scrolls down and allows them to quickly return to the top of the page.

### Features:

- Appears after scrolling 300px down
- Smooth scroll animation
- Responsive design
- Hover effects with scale animation
- Accessible with proper ARIA labels

### Usage:

The component is automatically included in the root layout and appears on all pages.

## Discount Popup

A promotional popup that appears after a configurable delay to offer discounts to users.

### Features:

- Configurable discount percentage and code
- Countdown timer
- Session-based display (won't show again if dismissed)
- Automatic clipboard copy of discount code
- Responsive design with animations
- Easy to enable/disable

### Configuration:

Edit `src/lib/discount-config.ts` to customize the popup:

```typescript
export const discountConfig: DiscountConfig = {
  enabled: true, // Set to false to disable popup
  discountPercentage: 25, // Discount percentage to display
  discountCode: "HUMANLY25", // Discount code to copy
  title: "🎉 Limited Time Offer!", // Popup title
  description: "Transform your AI content...", // Description text
  ctaText: "Get 20% Off Now", // Button text
  ctaLink: "/pricing", // Where to redirect when clicked
  showTimer: true, // Show/hide countdown timer
  timerMinutes: 15, // Timer duration in minutes
  delaySeconds: 8, // Delay before showing popup
};
```

### Programmatic Control:

You can also control the popup programmatically using the `useDiscountPopup` hook:

```typescript
import { useDiscountPopup } from "@/hooks/use-discount-popup";

function MyComponent() {
  const { openPopup, closePopup, resetPopup } = useDiscountPopup();

  return (
    <div>
      <button onClick={openPopup}>Show Discount</button>
      <button onClick={resetPopup}>Reset Popup State</button>
    </div>
  );
}
```

### Session Management:

The popup uses `sessionStorage` to track its state:

- `discount-popup-shown`: Set when popup is first displayed
- `discount-popup-dismissed`: Set when user closes the popup

This ensures the popup only appears once per session unless manually triggered.

### Customization:

To create different popup configurations (e.g., holiday specials), you can:

1. Create additional config objects in `discount-config.ts`
2. Modify the `DiscountPopup` component to accept a config prop
3. Conditionally render different popups based on dates or other criteria

Example:

```typescript
// In discount-config.ts
export const holidayDiscountConfig: DiscountConfig = {
  enabled: false,
  discountPercentage: 40,
  discountCode: "HOLIDAY40",
  // ... other config
};

// Usage
<DiscountPopup config={isHolidaySeason ? holidayDiscountConfig : discountConfig} />
```
