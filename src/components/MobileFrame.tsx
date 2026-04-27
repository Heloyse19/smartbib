import { ReactNode } from "react";

export const MobileFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-0 md:p-8">
      <div className="w-full h-screen md:w-[400px] md:h-[820px] md:rounded-[2.5rem] md:border-8 md:border-foreground/90 md:shadow-2xl bg-background overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
};
