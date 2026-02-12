// Vercel serverless function (ES module)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default require('../dist/serverless.cjs');
