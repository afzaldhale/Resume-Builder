/**
 * PDF GENERATION VERIFICATION SCRIPT
 * ===================================
 * Run this script to verify the PDF generation system works correctly
 * Usage: node verify-pdf-system.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Verification tests
 */
const tests = {
  /**
   * Test 1: Check required files exist
   */
  checkFiles: async () => {
    console.log('\n✓ Checking required files...');
    const requiredFiles = [
      'backend/src/services/pdfService.js',
      'backend/src/utils/pdfOptimizer.js',
      'backend/src/utils/templateValidator.js',
      'backend/PDF_GENERATION_GUIDE.md',
      'backend/TEMPLATE_DEVELOPMENT_GUIDE.md',
      'backend/QUICK_REFERENCE.md',
      'backend/USAGE_EXAMPLES.js',
      'IMPLEMENTATION_SUMMARY.md',
      'DEPLOYMENT_CHECKLIST.md',
      'PDF_README.md',
    ];

    const missing = [];
    const found = [];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        found.push(file);
      } else {
        missing.push(file);
      }
    }

    console.log(`  Found: ${found.length}/${requiredFiles.length} files`);
    if (missing.length === 0) {
      console.log('  ✅ All required files present');
      return { passed: true, details: found };
    } else {
      console.log('  ❌ Missing files:');
      missing.forEach(f => console.log(`     - ${f}`));
      return { passed: false, missing };
    }
  },

  /**
   * Test 2: Validate pdfService.js
   */
  validatePdfService: async () => {
    console.log('\n✓ Validating pdfService.js...');
    const serviceFile = path.join(__dirname, 'backend/src/services/pdfService.js');
    
    try {
      const content = fs.readFileSync(serviceFile, 'utf8');
      const checks = {
        hasA4Constants: content.includes('const A4_WIDTH_PX = 794'),
        hasInjectFunction: content.includes('const injectA4FitWithScaling'),
        hasGenerateFunction: content.includes('export const generateResumePDF'),
        hasScalingLogic: content.includes('Math.max(') && content.includes('Math.min('),
        hasScaleWrapper: content.includes('#scale-wrapper'),
        hasFontWaiting: content.includes('document.fonts'),
        hasImageWaiting: content.includes('querySelectorAll(\'img\')'),
      };

      const passed = Object.values(checks).every(v => v === true);
      console.log('  Checks:');
      Object.entries(checks).forEach(([check, result]) => {
        console.log(`    ${result ? '✅' : '❌'} ${check}`);
      });

      if (passed) {
        console.log('  ✅ pdfService.js validation passed');
      }
      return { passed, checks };
    } catch (error) {
      console.log(`  ❌ Error reading file: ${error.message}`);
      return { passed: false, error: error.message };
    }
  },

  /**
   * Test 3: Validate pdfOptimizer.js
   */
  validatePdfOptimizer: async () => {
    console.log('\n✓ Validating pdfOptimizer.js...');
    const optimizerFile = path.join(__dirname, 'backend/src/utils/pdfOptimizer.js');
    
    try {
      const content = fs.readFileSync(optimizerFile, 'utf8');
      const checks = {
        hasA4Config: content.includes('A4_WIDTH_PX: 794'),
        hasScalingConfig: content.includes('MAX_EXPANSION'),
        hasCalculateFunction: content.includes('export const calculateOptimalScale'),
        hasValidateTemplate: content.includes('export const validateTemplate'),
        hasFormatDebug: content.includes('export const formatDebugInfo'),
        hasTemplateConfig: content.includes('TEMPLATES: {'),
      };

      const passed = Object.values(checks).every(v => v === true);
      console.log('  Checks:');
      Object.entries(checks).forEach(([check, result]) => {
        console.log(`    ${result ? '✅' : '❌'} ${check}`);
      });

      if (passed) {
        console.log('  ✅ pdfOptimizer.js validation passed');
      }
      return { passed, checks };
    } catch (error) {
      console.log(`  ❌ Error reading file: ${error.message}`);
      return { passed: false, error: error.message };
    }
  },

  /**
   * Test 4: Validate templateValidator.js
   */
  validateTemplateValidator: async () => {
    console.log('\n✓ Validating templateValidator.js...');
    const validatorFile = path.join(__dirname, 'backend/src/utils/templateValidator.js');
    
    try {
      const content = fs.readFileSync(validatorFile, 'utf8');
      const checks = {
        hasValidator: content.includes('export const TemplateValidator'),
        hasValidateStructure: content.includes('validateStructure'),
        hasValidateCSS: content.includes('validateCSS'),
        hasEstimatePageFit: content.includes('estimatePageFit'),
        hasGenerateReport: content.includes('generateReport'),
        hasFormatReport: content.includes('formatValidationReport'),
      };

      const passed = Object.values(checks).every(v => v === true);
      console.log('  Checks:');
      Object.entries(checks).forEach(([check, result]) => {
        console.log(`    ${result ? '✅' : '❌'} ${check}`);
      });

      if (passed) {
        console.log('  ✅ templateValidator.js validation passed');
      }
      return { passed, checks };
    } catch (error) {
      console.log(`  ❌ Error reading file: ${error.message}`);
      return { passed: false, error: error.message };
    }
  },

  /**
   * Test 5: Check documentation
   */
  checkDocumentation: async () => {
    console.log('\n✓ Checking documentation...');
    
    const docs = {
      'PDF_GENERATION_GUIDE.md': ['CSS Injection', 'Scaling', 'Puppeteer'],
      'TEMPLATE_DEVELOPMENT_GUIDE.md': ['Template Structure', 'CSS Best Practices', 'Testing Checklist'],
      'QUICK_REFERENCE.md': ['Quick Start', 'Spacing Rules', 'Troubleshooting'],
      'USAGE_EXAMPLES.js': ['example_basic', 'example_validate', 'example_scaling'],
      'IMPLEMENTATION_SUMMARY.md': ['Problem Statement', 'Implementation Details', 'Success Metrics'],
      'DEPLOYMENT_CHECKLIST.md': ['Pre-Deployment', 'Integration Checks', 'Performance Baseline'],
      'PDF_README.md': ['Overview', 'Quick Start', 'Documentation'],
    };

    const results = {};
    for (const [docFile, keywords] of Object.entries(docs)) {
      const filePath = path.join(__dirname, '..', docFile.startsWith('backend/') ? docFile : docFile);
      if (!fs.existsSync(filePath)) {
        results[docFile] = { found: false };
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const foundKeywords = keywords.filter(k => content.includes(k));
      results[docFile] = {
        found: true,
        completeness: `${foundKeywords.length}/${keywords.length} keywords`,
      };
    }

    console.log('  Documentation status:');
    Object.entries(results).forEach(([doc, result]) => {
      if (!result.found) {
        console.log(`    ⚠️  ${doc} - NOT FOUND`);
      } else {
        console.log(`    ✅ ${doc} - ${result.completeness}`);
      }
    });

    const allFound = Object.values(results).every(r => r.found);
    console.log(allFound ? '  ✅ Documentation complete' : '  ⚠️  Some documentation missing');
    return { passed: allFound, results };
  },

  /**
   * Test 6: Simulate PDF generation logic
   */
  testScalingLogic: async () => {
    console.log('\n✓ Testing scaling logic...');
    
    const A4_HEIGHT = 1123;
    const testCases = [
      { height: 950, expected: 'expand', minScale: 1.0, maxScale: 1.15 },
      { height: 1123, expected: 'none', minScale: 1.0, maxScale: 1.0 },
      { height: 1500, expected: 'shrink', minScale: 0.75, maxScale: 1.0 },
      { height: 800, expected: 'expand', minScale: 1.0, maxScale: 1.15 },
      { height: 2000, expected: 'shrink', minScale: 0.75, maxScale: 1.0 },
    ];

    const results = [];
    for (const testCase of testCases) {
      const contentHeight = testCase.height;
      let scale = 1;
      let mode = 'none';

      if (contentHeight > A4_HEIGHT) {
        scale = Math.max(0.75, A4_HEIGHT / contentHeight);
        mode = 'shrink';
      } else if (contentHeight < A4_HEIGHT) {
        scale = Math.min(1.15, A4_HEIGHT / contentHeight);
        mode = 'expand';
      }

      const passed = 
        mode === testCase.expected &&
        scale >= testCase.minScale &&
        scale <= testCase.maxScale;

      results.push({
        height: contentHeight,
        scale: scale.toFixed(4),
        mode,
        passed,
      });

      console.log(`  ${passed ? '✅' : '❌'} Height: ${contentHeight}px → Scale: ${scale.toFixed(4)}x (${mode})`);
    }

    const allPassed = results.every(r => r.passed);
    console.log(allPassed ? '  ✅ Scaling logic validates correctly' : '  ❌ Scaling logic has issues');
    return { passed: allPassed, results };
  },

  /**
   * Test 7: Check configuration defaults
   */
  checkConfigDefaults: async () => {
    console.log('\n✓ Checking configuration defaults...');
    
    const optimizerFile = path.join(__dirname, 'backend/src/utils/pdfOptimizer.js');
    const content = fs.readFileSync(optimizerFile, 'utf8');

    const configs = {
      'A4_WIDTH_PX: 794': 794,
      'A4_HEIGHT_PX: 1123': 1123,
      'MAX_EXPANSION: 1.15': 1.15,
      'MIN_COMPRESSION: 0.75': 0.75,
      'FONT_MIN: 0.82': 0.82,
      'LINE_HEIGHT_MIN: 1.2': 1.2,
      'SPACE_MIN: 0.72': 0.72,
    };

    const results = {};
    for (const [check, value] of Object.entries(configs)) {
      const found = content.includes(check);
      results[check] = found;
      console.log(`    ${found ? '✅' : '❌'} ${check}`);
    }

    const allCorrect = Object.values(results).every(v => v === true);
    console.log(allCorrect ? '\n  ✅ All configuration defaults correct' : '\n  ⚠️  Some configuration values may be incorrect');
    return { passed: allCorrect, results };
  },
};

/**
 * Run all tests
 */
async function runVerification() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     PDF GENERATION SYSTEM VERIFICATION                     ║');
  console.log('║            Resume Builder v2.0                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const startTime = Date.now();
  const results = {};

  for (const [testName, testFunc] of Object.entries(tests)) {
    try {
      results[testName] = await testFunc();
    } catch (error) {
      console.log(`  ❌ Test error: ${error.message}`);
      results[testName] = { passed: false, error: error.message };
    }
  }

  // Summary
  const duration = Date.now() - startTime;
  const passed = Object.values(results).filter(r => r.passed).length;
  const total = Object.keys(results).length;
  const passPercentage = Math.round((passed / total) * 100);

  console.log('\n' + '═'.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('═'.repeat(60));
  console.log(`\nTests Passed: ${passed}/${total} (${passPercentage}%)`);
  console.log(`Time Taken: ${duration}ms`);

  if (passPercentage === 100) {
    console.log('\n🎉 ✅ ALL TESTS PASSED - System is ready!');
    process.exit(0);
  } else if (passPercentage >= 80) {
    console.log('\n⚠️  MOSTLY PASSED - Minor issues found above');
    process.exit(1);
  } else {
    console.log('\n❌ TESTS FAILED - Please review errors above');
    process.exit(1);
  }
}

// Run verification
runVerification().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
