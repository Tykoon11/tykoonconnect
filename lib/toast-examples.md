# Toast System Usage Examples

## Basic Usage

```tsx
import { useToast } from '@/components/ui/toast'

function MyComponent() {
  const { addToast } = useToast()
  
  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success!',
      description: 'Operation completed successfully'
    })
  }
  
  return <button onClick={handleSuccess}>Show Toast</button>
}
```

## Using ToastUtils for Common Patterns

```tsx
import { useToast } from '@/components/ui/toast'
import { createToastUtils } from '@/lib/toast-utils'

function MyComponent() {
  const { addToast } = useToast()
  const toast = createToastUtils(addToast)
  
  const handleFormSubmit = async () => {
    try {
      await submitForm()
      toast.success('Form submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit form', error.message)
    }
  }
  
  const handleFileUpload = async (file) => {
    toast.fileUploadStart(file.name)
    try {
      await uploadFile(file)
      toast.fileUploadSuccess(file.name)
    } catch (error) {
      toast.fileUploadError(file.name, 'File too large')
    }
  }
}
```

## Production Features

### 1. **Accessibility**
- Screen reader support with `aria-live` regions
- Keyboard navigation (ESC to dismiss)
- Proper ARIA labels and roles

### 2. **Performance**
- Limited to 5 toasts maximum
- Proper cleanup of timeouts
- Memory leak prevention
- Smooth animations

### 3. **User Experience**
- Different durations based on type (errors show longer)
- Persistent toasts for critical messages
- Action buttons for user interaction
- Hover to pause auto-dismiss

### 4. **Production Ready**
- Error boundary integration
- Comprehensive error logging
- TypeScript support
- Common patterns utility

## Advanced Examples

### Toast with Action Button
```tsx
addToast({
  type: 'warning',
  title: 'Unsaved Changes',
  description: 'You have unsaved changes. Save before leaving?',
  persistent: true,
  action: {
    label: 'Save Now',
    onClick: () => saveChanges()
  }
})
```

### Error Reporting
```tsx
// In production, errors are automatically logged with context
try {
  await riskyOperation()
} catch (error) {
  toast.error('Operation failed', 'Please contact support if this persists')
  // Error details are logged automatically in production
}
```

### Business Logic Toasts
```tsx
// Pre-built business logic toasts
toast.proposalSent('Alice Johnson')
toast.paymentProcessed('2,500')
toast.maintenanceMode()
```

The toast system is now production-ready with:
- ✅ Hydration error fixes
- ✅ Full accessibility support  
- ✅ Performance optimizations
- ✅ Error boundary integration
- ✅ Comprehensive TypeScript types
- ✅ Business logic utilities