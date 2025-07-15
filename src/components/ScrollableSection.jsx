import React, { useEffect, useRef } from 'react';

const ScrollableSection = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  isActive, 
  className = '',
  icon = null 
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is visible, could trigger active state here if needed
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-120px 0px -50% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id={`section-${id}`}
      ref={sectionRef}
      className={`scroll-section ${className} ${isActive ? 'active' : ''}`}
    >
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="section-header text-center mb-6 md:mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-river-red mb-2 flex items-center justify-center gap-2">
                {icon && <span className="text-2xl md:text-3xl">{icon}</span>}
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Section Content */}
        <div className="section-content">
          {children}
        </div>
      </div>
    </section>
  );
};

export default ScrollableSection;
