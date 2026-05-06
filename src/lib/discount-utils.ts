/**
 * Utility functions for managing the discount popup
 */

export class DiscountPopupManager {
  private static readonly STORAGE_KEYS = {
    SHOWN: "discount-popup-shown",
    DISMISSED: "discount-popup-dismissed",
  } as const;

  /**
   * Check if the popup has been shown in this session
   */
  static hasBeenShown(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(this.STORAGE_KEYS.SHOWN) === "true";
  }

  /**
   * Check if the popup has been dismissed in this session
   */
  static hasBeenDismissed(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(this.STORAGE_KEYS.DISMISSED) === "true";
  }

  /**
   * Mark the popup as shown
   */
  static markAsShown(): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(this.STORAGE_KEYS.SHOWN, "true");
  }

  /**
   * Mark the popup as dismissed
   */
  static markAsDismissed(): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(this.STORAGE_KEYS.DISMISSED, "true");
  }

  /**
   * Reset the popup state (allows it to be shown again)
   */
  static reset(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(this.STORAGE_KEYS.SHOWN);
    sessionStorage.removeItem(this.STORAGE_KEYS.DISMISSED);
  }

  /**
   * Check if the popup should be displayed
   */
  static shouldShow(): boolean {
    return !this.hasBeenShown() && !this.hasBeenDismissed();
  }

  /**
   * Force show the popup (resets state and triggers display)
   */
  static forceShow(): void {
    this.reset();
    // Dispatch a custom event that the popup component can listen to
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("force-show-discount-popup"));
    }
  }
}

/**
 * Copy discount code to clipboard with error handling
 */
export async function copyDiscountCode(code: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error("Failed to copy discount code:", error);
    return false;
  }
}

/**
 * Format time remaining in MM:SS format
 */
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Calculate time remaining until a specific date
 */
export function getTimeUntilDate(targetDate: Date): number {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  return Math.max(0, Math.floor((target - now) / 1000));
}
