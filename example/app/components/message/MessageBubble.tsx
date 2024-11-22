import type { ReactNode } from "react";

type MessageBubbleProps = {
  userRole: boolean;
  children: ReactNode;
};

export const MessageBubble = ({ userRole, children }: MessageBubbleProps) => {
  return (
    <div className={`flex ${userRole ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 ${
          userRole
            ? "rounded-l-lg rounded-tr-lg bg-primary text-primary-foreground"
            : "rounded-r-lg rounded-tl-lg bg-default-100"
        } max-w-[80%] text-sm`}
      >
        {children}
      </div>
    </div>
  );
}; 