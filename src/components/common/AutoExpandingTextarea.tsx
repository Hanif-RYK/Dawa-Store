import React, { useRef, useEffect } from 'react';

interface AutoExpandingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxHeight?: number;
}

export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({
  value,
  onChange,
  className = '',
  rows = 2,
  minRows = 2,
  maxHeight = 400,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const targetHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${Math.max(targetHeight, minRows * 22)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      className={`resize-y transition-all ${className}`}
      {...props}
    />
  );
};
