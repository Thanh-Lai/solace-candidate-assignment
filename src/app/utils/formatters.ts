/**
 * Formats a phone number string to (XXX) XXX-XXXX format
 * @param phoneNumberString - The phone number to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumberString: string): string {
  const cleaned = phoneNumberString.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString;
} 