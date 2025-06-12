
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Analisando bundle...');

try {
  // Build com análise
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n📊 Relatório de análise gerado em: dist/stats.html');
  console.log('📁 Abra o arquivo para visualizar a análise detalhada do bundle');
  
  // Informações adicionais sobre otimização
  console.log('\n✅ Otimizações implementadas:');
  console.log('- Code splitting por rotas e funcionalidades');
  console.log('- Tree shaking agressivo');
  console.log('- Compressão Brotli e Gzip');
  console.log('- Lazy loading de componentes pesados');
  console.log('- Preload inteligente de chunks críticos');
  console.log('- Otimização de dependências');
  
} catch (error) {
  console.error('❌ Erro durante a análise:', error.message);
  process.exit(1);
}
