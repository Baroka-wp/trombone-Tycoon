import { ToastType } from "../types";

export const getAlertTypeFromMessage = (alertText: string): ToastType => {
  if (alertText.includes('FAILLITE') || alertText.startsWith('🚨') || alertText.startsWith('💥')) return 'error';
  if (alertText.startsWith('⚠️')) return 'warning';
  if (alertText.startsWith('💡')) return 'info';
  if (alertText.startsWith('✅') || alertText.startsWith('🎉')) return 'success';
  return 'info';
};
