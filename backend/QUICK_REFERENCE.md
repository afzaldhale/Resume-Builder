# PDF Generation - Quick Reference

## 🎯 The Goal

Every resume PDF must:
- Fit **exactly 1 page** (794×1123 px)
- Use **100% vertical space** (no empty bottom)
- **Scale dynamically** to fill or shrink as needed
- Maintain **visual quality** at all scales
- **Never distort** fonts or layout

---

## 🔧 Template Structure (REQUIRED)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    .page {
      width: 794px;
      height: 1123px;
      padding: 32px;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- ALL content goes here -->
  </div>
</body>
</html>
```

**⚠️ CRITICAL:** Must have single `.page` container!

---

## 📏 Key CSS Rules

### DO ✅
```css
* {
  box-sizing: border-box;  /* Include padding in dimensions */
}

.page {
  width: 794px;
  height: 1123px;
  padding: 32px;
}

h2 {
  margin: 12px 0 8px 0;  /* Tight spacing */
}

p, li {
  margin: 4px 0;  /* Minimal margins */
}

img {
  width: 100%;
  height: auto;  /* Prevent distortion */
}
```

### DON'T ❌
```css
.section {
  min-height: 150px;  /* Prevents shrinking */
}

.page {
  position: absolute;  /* Breaks measurement */
}

h1 {
  margin: 30px 0;  /* Excessive spacing */
}

/* Multiple .page containers */
<div class="page">...</div>
<div class="page">...</div>
```

---

## 🎛️ Spacing Rules

| Element | Margin | Line Height |
|---------|--------|-------------|
| h1 | 0 0 4px 0 | 1.1-1.2 |
| h2 | 12px 0 8px 0 | 1.2 |
| h3 | 0 0 4px 0 | 1.2 |
| p | 4px 0 | 1.4-1.5 |
| li | 4px 0 | 1.4-1.5 |

**Goal:** Tight vertical spacing to maximize content

---

## 📐 Font Sizes

**DO NOT go below 10px base font!**

| Element | Size |
|---------|------|
| Body | 11px |
| h1 | 22-26px |
| h2 | 13-14px |
| h3 | 11-12px |
| p | 11px |
| Small | 10px |

---

## 🔄 Scaling System

```
Content Height < 1123px
        ↓
    EXPAND (max 1.15x)
    Fill empty space
        ↓
    Normal display
        
Content Height > 1123px
        ↓
    SHRINK (min 0.75x)
    Fit on one page
        ↓
    Normal display
```

**Example:**
- Content = 950px → Scale 1.18x → Fills page
- Content = 1500px → Scale 0.75x → Fits on page

---

## 🧪 Testing Checklist

```
[ ] Single .page container
[ ] No position: absolute/fixed
[ ] All fonts ≥ 10px
[ ] Box margins tight (≤12px)
[ ] Images have max-width: 100%
[ ] No overflow visible
[ ] padding included in width/height
[ ] Content at top (margin-top: 0)
[ ] Width exactly 794px
[ ] Height fits ≤2000px max
```

---

## 🚀 API Usage

### Generate PDF
```javascript
const pdf = await generateResumePDF(
  resumeData,
  templateId
);

// With debug mode
const pdf = await generateResumePDF(
  resumeData,
  templateId,
  { debugMode: true }
);
```

### Validate Template
```javascript
import { TemplateValidator } from '../utils/templateValidator.js';

const report = TemplateValidator.generateReport(
  htmlString,
  cssString,
  contentHeight,
  resumeData
);

console.log(TemplateValidator.formatValidationReport(report));
```

### Check Scaling
```javascript
import { calculateOptimalScale } from '../utils/pdfOptimizer.js';

const result = calculateOptimalScale(1050);
// {
//   scale: 1.0696,
//   scalingMode: 'expand',
//   finalHeight: 1123,
//   verticalUtilization: 100.0
// }
```

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Empty space at bottom | Content too short | ✅ Already handled (scales up) |
| Text too small | Content too large | Reduce content size |
| Distorted layout | Extreme scaling | Check safe margins |
| Missing fonts | Font not loading | Use system fonts (Arial, sans-serif) |
| Overflow text | Too much content | Trim description lengths |
| Images stretched | No `height: auto` | Add to CSS |

---

## 🎨 Common Patterns

### Two-Column Layout
```css
.page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.sidebar {
  overflow: hidden;      /* Constrain width */
  word-break: break-word;
  word-wrap: break-word;
}
```

### Skill Pills
```css
.skill {
  display: inline-block;
  background: #e8f4f8;
  color: #0066cc;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  margin: 0 4px 4px 0;
}
```

### Section Header
```css
h2 {
  font-size: 13px;
  margin: 12px 0 8px 0;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}
```

---

## 📊 Debug Output

Enable logging:
```bash
PDF_DEBUG=true npm start
```

Console shows:
```
📏 Content Analysis:
   Content Height: 1050px
   A4 Height: 1123px
   Ratio: 0.935

📈 Expanding to fill: 1.0696
✅ Final scale applied: 1.0696
```

---

## 🔗 Full Documentation

- **PDF Generation Guide:** `PDF_GENERATION_GUIDE.md`
- **Template Development:** `TEMPLATE_DEVELOPMENT_GUIDE.md`
- **Optimizer Utils:** `src/utils/pdfOptimizer.js`
- **Validator Utility:** `src/utils/templateValidator.js`

---

## ⚡ Performance

- **Time:** ~2 seconds per PDF
- **Size:** 200-400 KB typical
- **Quality:** Print-ready (300 DPI equivalent)

---

## 🎓 Best Practice Summary

1. **Single .page container** (794×1123px)
2. **Tight spacing** (margins ≤12px)
3. **Font size ≥10px** (readability)
4. **Responsive images** (width: 100%, height: auto)
5. **No position: absolute** (breaks measurement)
6. **Box-sizing: border-box** (consistent layout)
7. **Test with min & max content** (scalability)

---

**Last Updated:** April 2025
**Version:** 2.0
