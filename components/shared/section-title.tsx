interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps): JSX.Element {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="font-display text-xl tracking-wide text-accent neon-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-0.5 text-sm text-foreground-muted">{subtitle}</p>
      )}
    </div>
  );
}
