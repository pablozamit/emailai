
import React from 'react';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full p-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors text-sm ${className}`}
      {...props}
    />
  );
});
