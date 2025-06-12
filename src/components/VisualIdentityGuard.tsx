
import { useEffect } from 'react';

/**
 * Componente de Proteção da Identidade Visual
 * Garante que as variáveis CSS da sidebar nunca sejam alteradas
 */
export const VisualIdentityGuard = () => {
  useEffect(() => {
    // Força as variáveis CSS específicas da sidebar
    const root = document.documentElement;
    
    const sidebarVars = {
      '--sidebar-background': '220 25% 5%',
      '--sidebar-foreground': '210 40% 98%',
      '--sidebar-primary': '221 83% 53%',
      '--sidebar-primary-foreground': '210 40% 98%',
      '--sidebar-accent': '220 20% 12%',
      '--sidebar-accent-foreground': '210 40% 98%',
      '--sidebar-border': '220 20% 15%',
      '--sidebar-ring': '221 83% 53%'
    };

    // Aplica as variáveis com !important via JavaScript
    Object.entries(sidebarVars).forEach(([property, value]) => {
      root.style.setProperty(property, value, 'important');
    });

    // Observa mudanças e força as variáveis novamente
    const observer = new MutationObserver(() => {
      Object.entries(sidebarVars).forEach(([property, value]) => {
        const currentValue = getComputedStyle(root).getPropertyValue(property);
        if (currentValue.trim() !== value) {
          root.style.setProperty(property, value, 'important');
          console.warn(`🔒 Identidade Visual Protegida: ${property} foi forçado para ${value}`);
        }
      });
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => observer.disconnect();
  }, []);

  return null;
};
