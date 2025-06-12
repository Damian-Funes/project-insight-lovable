
# DESIGN SYSTEM - IDENTIDADE VISUAL FIXA

## ⚠️ AVISO CRÍTICO
**ESTA IDENTIDADE VISUAL NUNCA DEVE SER ALTERADA!**

## Especificações Visuais Obrigatórias

### Sidebar
- **Background**: `--sidebar-background: 220 25% 5%` (tom escuro específico)
- **Largura**: 16rem (256px)
- **Border**: Sem borda visível na lateral direita
- **Padding**: Consistente em toda a estrutura

### Header da Sidebar
- **Logo**: Ícone TrendingUp em gradiente azul/roxo
- **Título**: "FinPlan" em fonte bold
- **Subtítulo**: "Planejamento Estratégico" em cor muted
- **Espaçamento**: 6 unidades de padding

### Menu de Navegação
- **Label**: "NAVEGAÇÃO" em texto pequeno e muted
- **Itens**: 
  - Dashboard (BarChart3)
  - Registro de Atividades (Clock)
  - Projetos (FolderOpen)
  - Áreas Produtivas (Users)
  - Gestão de Áreas (Settings)
  - Dashboards de Custos (DollarSign)
  - Relatórios (FileText)
- **Estado Ativo**: Background azul primary com texto branco
- **Hover**: Background accent sutil

### Footer da Sidebar
- **Avatar**: Círculo com inicial do usuário
- **Email**: Texto truncado se necessário
- **Cargo**: "Líder de Área"
- **Botão Sair**: Com ícone LogOut

### Cores Principais (NUNCA ALTERAR)
```css
--sidebar-background: 220 25% 5%;
--sidebar-foreground: 210 40% 98%;
--sidebar-primary: 221 83% 53%;
--sidebar-accent: 220 20% 12%;
--sidebar-border: 220 20% 15%;
```

### Funcionalidades Obrigatórias
- Botão de collapse/expand
- Responsividade para mobile
- Estados de hover e ativo
- Gradientes no logo e avatar

## REGRAS DE IMPLEMENTAÇÃO
1. NUNCA alterar as cores definidas
2. NUNCA remover funcionalidades existentes
3. NUNCA alterar a estrutura do layout
4. SEMPRE manter a consistência visual
5. SEMPRE testar em diferentes resoluções
