import { Toast } from '@/components/ui/toast'

type ToastOptions = Omit<Toast, 'id'>

export class ToastUtils {
  private addToast: (toast: ToastOptions) => void

  constructor(addToast: (toast: ToastOptions) => void) {
    this.addToast = addToast
  }

  // Success toasts
  success(title: string, description?: string, duration?: number) {
    this.addToast({
      type: 'success',
      title,
      description,
      duration
    })
  }

  // Error toasts (with longer duration by default)
  error(title: string, description?: string, persistent?: boolean) {
    this.addToast({
      type: 'error',
      title,
      description,
      duration: persistent ? undefined : 7000,
      persistent
    })
  }

  // Warning toasts
  warning(title: string, description?: string) {
    this.addToast({
      type: 'warning',
      title,
      description
    })
  }

  // Info toasts
  info(title: string, description?: string) {
    this.addToast({
      type: 'info',
      title,
      description
    })
  }

  // Common business logic toasts
  proposalSent(clientName: string) {
    this.success(
      'Proposal Sent!',
      `Your proposal has been sent to ${clientName}. They will be notified and can respond directly.`
    )
  }

  proposalError() {
    this.error(
      'Failed to Send Proposal',
      'There was an error sending your proposal. Please try again.',
      false
    )
  }

  jobPosted() {
    this.success(
      'Job Posted Successfully!',
      'Your job is now live and freelancers can start submitting proposals.'
    )
  }

  paymentProcessed(amount: string) {
    this.success(
      'Payment Processed',
      `$${amount} has been successfully processed. Thank you for your payment!`
    )
  }

  validationError(message?: string) {
    this.error(
      'Please fix the errors',
      message || 'Please review the form and correct any validation errors.',
      false
    )
  }

  networkError() {
    this.error(
      'Connection Error',
      'Unable to connect to our servers. Please check your internet connection and try again.',
      false
    )
  }

  unauthorizedError() {
    this.error(
      'Access Denied',
      'You need to be logged in to perform this action.',
      true
    )
  }

  maintenanceMode() {
    this.warning(
      'Scheduled Maintenance',
      'The platform will undergo scheduled maintenance in 15 minutes. Please save your work.'
    )
  }

  featureUnavailable(featureName: string) {
    this.info(
      'Feature Coming Soon',
      `${featureName} is not yet available. We're working hard to bring it to you soon!`
    )
  }

  // Toast with action button
  withAction(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    description: string,
    actionLabel: string,
    actionCallback: () => void
  ) {
    this.addToast({
      type,
      title,
      description,
      action: {
        label: actionLabel,
        onClick: actionCallback
      }
    })
  }

  // File upload toasts
  fileUploadStart(fileName: string) {
    this.info(
      'Uploading File',
      `Uploading ${fileName}...`
    )
  }

  fileUploadSuccess(fileName: string) {
    this.success(
      'File Uploaded',
      `${fileName} has been successfully uploaded.`
    )
  }

  fileUploadError(fileName: string, reason?: string) {
    this.error(
      'Upload Failed',
      `Failed to upload ${fileName}. ${reason || 'Please try again.'}`,
      false
    )
  }

  // Profile/settings toasts
  profileUpdated() {
    this.success(
      'Profile Updated',
      'Your profile has been successfully updated.'
    )
  }

  passwordChanged() {
    this.success(
      'Password Updated',
      'Your password has been successfully changed.'
    )
  }

  settingsSaved() {
    this.success(
      'Settings Saved',
      'Your preferences have been saved successfully.'
    )
  }
}

// Helper function to create ToastUtils instance
export function createToastUtils(addToast: (toast: ToastOptions) => void) {
  return new ToastUtils(addToast)
}

// Common toast patterns for immediate use
export const commonToasts = {
  copySuccess: {
    type: 'success' as const,
    title: 'Copied!',
    description: 'Text copied to clipboard.',
    duration: 2000
  },
  
  saveSuccess: {
    type: 'success' as const,
    title: 'Saved!',
    description: 'Your changes have been saved successfully.'
  },

  deleteConfirm: (itemName: string, onConfirm: () => void) => ({
    type: 'warning' as const,
    title: 'Confirm Deletion',
    description: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
    persistent: true,
    action: {
      label: 'Delete',
      onClick: onConfirm
    }
  })
}