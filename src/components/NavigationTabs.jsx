import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const NavigationTabs = ({ tabs, activeTab, onTabChange, onClearAll, className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (tabId) => {
    const element = document.getElementById(`section-${tabId}`);
    if (element) {
      const headerHeight = 120; // Height of fixed header + nav
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    onTabChange(tabId);
  };

  return (
    <nav className={`app-nav ${isScrolled ? 'scrolled' : ''} ${className}`}>
      <div className="container">
        <div className="nav-content">
          {/* Mobile: Horizontal scroll tabs */}
          <div className="md:hidden">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-1 p-1">
                {tabs.map(tab => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => scrollToSection(tab.id)}
                    className={`flex-shrink-0 min-w-fit px-3 py-2 text-xs ${
                      activeTab === tab.id 
                        ? 'bg-river-red text-white hover:bg-river-red-dark' 
                        : 'text-river-red hover:bg-river-red/10'
                    }`}
                  >
                    <span className="truncate max-w-20">{tab.label}</span>
                    {tab.count !== null && (
                      <Badge 
                        variant="secondary" 
                        className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                      >
                        {tab.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Desktop: Regular tabs */}
          <div className="hidden md:flex md:space-x-1">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => scrollToSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 ${
                  activeTab === tab.id 
                    ? 'bg-river-red text-white hover:bg-river-red-dark' 
                    : 'text-river-red hover:bg-river-red/10'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30"
                  >
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="app-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="border-river-red/30 text-river-red hover:bg-river-red hover:text-white"
            >
              Limpiar Todo
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;
