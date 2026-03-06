interface PageTransitionProps {
  children: React.ReactNode;
}

// Simple wrapper with no animations - page transitions removed for reliability
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

// All transition variants simplified to simple wrappers (no animations)
export function GoldCurtainTransition({ children }: PageTransitionProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

export function FadeSlideTransition({ children }: PageTransitionProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
