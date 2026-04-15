# Resume Template Development Guide

## For PDF Scaling Compatibility

This guide ensures your resume templates work perfectly with the new A4 scaling system.

---

## Template Structure

### Required HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Resume</title>
  <style>
    /* Your template styles here */
  </style>
</head>
<body>
  <div class="page">
    <!-- ALL content must be inside .page container -->
    <!-- Header, sections, footer, etc. -->
  </div>
</body>
</html>
```

### Why `.page` is Critical

- **Primary container** for all content
- **Fixed dimensions:** 794px × 1123px (A4)
- **Establishes scope** for overflow detection
- **Enables scaling** without breaking layout

---

## CSS Best Practices

### 1. Box Sizing

```css
* {
  box-sizing: border-box;
}

.page {
  width: 794px;
  height: 1123px;
  padding: 32px;  /* Include padding in width/height */
}
```

**Why:** Prevents padding from expanding dimensions beyond A4

### 2. Avoid Height Creep

❌ **Bad:**
```css
.section {
  min-height: 150px;  /* Forces expansion */
  margin-bottom: 20px;
}
```

✅ **Good:**
```css
.section {
  margin-bottom: 20px;
  /* Let content flow naturally */
}
```

### 3. Margin Collapsing

```css
/* Enable margin collapsing */
.page {
  overflow: visible;  /* Not hidden, allows collapsing */
}

h2 {
  margin: 16px 0 8px 0;
}

p {
  margin: 0 0 8px 0;
}
```

**Result:** Adjacent margins overlap, reducing total height

### 4. Flexible Layouts

Use flexbox smartly:

```css
.page {
  display: flex;
  flex-direction: column;
  height: 1123px;
}

/* Main content grows, footer stays fixed */
.content {
  flex: 1;
  overflow: hidden;
}

.footer {
  flex: 0 0 auto;
  height: 40px;
}
```

### 5. Line Height Control

```css
body {
  line-height: 1.4;  /* Reasonable default */
}

h1 { line-height: 1.2; }  /* Tighter for headers */
p { line-height: 1.5; }   /* Readable for body text */
```

**Note:** System will auto-adjust these +/- if needed

### 6. Padding vs Margin

Prefer margin for spacing between sections:

```css
/* GOOD: Uses margin (can collapse) */
.job {
  margin-bottom: 16px;
}

.job + .job {
  margin-top: 12px;
}

/* ACCEPTABLE: Padding for internal spacing */
.job {
  padding: 12px;
  background: #f5f5f5;
}
```

---

## Common Patterns

### Two-Column Layout

```css
.page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.sidebar {
  width: 280px;
  /* Content flows vertically */
}

.content {
  width: auto;
  /* Flexible width */
}

/* Prevent sidebar from expanding */
.sidebar {
  overflow: hidden;
  word-break: break-word;
}
```

### Section Headers

```css
h2 {
  font-size: 14px;
  font-weight: bold;
  margin: 12px 0 8px 0;
  text-transform: uppercase;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}
```

**Why?** Consistent sizing prevents header explosion

### List Items

```css
ul {
  list-style: none;
  padding-left: 0;
  margin: 4px 0;
}

li {
  margin: 4px 0;
  padding-left: 16px;
  text-indent: -8px;
}

li:before {
  content: "• ";
  width: 8px;
}
```

**Optimization:** Tight margins reduce vertical bloat

---

## What to Avoid

### ❌ Auto-expanding Elements

```css
/* BAD - Creates variable heights */
.section {
  min-height: calc(100% / 3);
}

.box {
  aspect-ratio: 1;  /* Dangerous on A4 */
}

.container {
  height: auto;  /* Can grow unbounded */
}
```

### ❌ Positioned Elements

```css
/* Breaks measurement! */
.footer {
  position: absolute;
  bottom: 0;
}

.sidebar {
  position: sticky;
  top: 0;
}
```

### ❌ Hardcoded Large Sizes

```css
/* Unnecessary size constraints */
.page {
  height: 2000px;  /* Causes shrinking */
  min-height: 1500px;  /* Unpredictable */
}
```

### ❌ Multiple Containers

```html
<!-- WRONG - Confuses scaling -->
<body>
  <div class="page">1</div>
  <div class="page">2</div>  <!-- Which one to measure? -->
</body>
```

### ❌ Overflowing Images

```css
img {
  width: 100%;
  /* No height: auto! */
}
```

**Fix:**
```css
img {
  width: 100%;
  height: auto;
  max-width: 100%;
}
```

---

## Testing Checklist

### Before Submitting Template

- [ ] **Structure**
  - [ ] Single `.page` container exists
  - [ ] All content inside `.page`
  - [ ] No nested `.page` elements
  - [ ] Valid HTML5 boilerplate

- [ ] **Dimensions**
  - [ ] `.page` width = 794px
  - [ ] `.page` height = 1123px
  - [ ] No position: absolute positioning
  - [ ] Padding consistent (32px typical)

- [ ] **Content Flow**
  - [ ] Content starts at top
  - [ ] No hidden overflow sections
  - [ ] Proper margins between sections
  - [ ] Line heights reasonable (1.2-1.5)

- [ ] **Scaling Compatibility**
  - [ ] Test with minimal content (fits with margin)
  - [ ] Test with full content (shrinks appropriately)
  - [ ] Fonts remain readable at 75% scale
  - [ ] Layout doesn't break at 115% scale

- [ ] **Print Preview**
  - [ ] Colors show correctly
  - [ ] Background images print (if used)
  - [ ] No overlapping text
  - [ ] Proper page breaks (if multi-page)

---

## Example: Optimal Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Resume</title>
  <style>
    * { box-sizing: border-box; }
    
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #333;
    }

    .page {
      width: 794px;
      height: 1123px;
      padding: 32px;
      background: white;
    }

    h1 {
      font-size: 24px;
      margin: 0 0 4px 0;
      line-height: 1.1;
    }

    .role {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 13px;
      font-weight: bold;
      margin: 12px 0 8px 0;
      text-transform: uppercase;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }

    .section {
      margin-bottom: 12px;
    }

    .job {
      margin-bottom: 10px;
    }

    .job h3 {
      font-size: 12px;
      font-weight: bold;
      margin: 0;
    }

    .meta {
      font-size: 10px;
      color: #999;
      margin-bottom: 4px;
    }

    p, li {
      margin: 4px 0;
      font-size: 11px;
    }

    ul {
      padding-left: 16px;
      margin: 4px 0;
    }

    .skill {
      display: inline-block;
      background: #e8f4f8;
      color: #0066cc;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      margin-right: 4px;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <h1>John Doe</h1>
    <p class="role">Senior Engineer</p>
    <p>📧 john@example.com | 📱 (555) 123-4567</p>

    <!-- Summary -->
    <h2>Professional Summary</h2>
    <p>10+ years of experience...</p>

    <!-- Experience -->
    <h2>Experience</h2>
    <div class="job">
      <h3>Sr. Engineer</h3>
      <p class="meta">Company Inc. | 2020-2024</p>
      <ul>
        <li>Led team of 5 engineers</li>
        <li>Increased performance by 40%</li>
      </ul>
    </div>

    <!-- Skills -->
    <h2>Skills</h2>
    <div>
      <span class="skill">JavaScript</span>
      <span class="skill">React</span>
      <span class="skill">Node.js</span>
    </div>
  </div>
</body>
</html>
```

---

## Common Issues & Fixes

### Issue: Spacing Changes at Different Scales

**Cause:** Using `em` units (relative to font size)

**Fix:**
```css
/* Use px instead */
h2 {
  margin: 12px 0 8px 0;  /* Fixed pixels */
  /* NOT: margin: 1em 0 0.5em 0; */
}
```

### Issue: Images Cause Layout Bloat

**Cause:** Large images not sized properly

**Fix:**
```css
img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
}
```

### Issue: Two-Column Layout Misaligns

**Cause:** Uneven height columns with margin

**Fix:**
```css
.sidebar {
  align-self: flex-start;  /* Keeps at top */
}

.sidebar, .content {
  margin-top: 0;  /* Align tops */
}
```

### Issue: Fonts Too Small After Scaling

**Cause:** Using small base font (< 10px)

**Fix:**
```css
body {
  font-size: 11px;  /* Minimum for readability */
}

h1 { font-size: 24px; }
h2 { font-size: 13px; }
h3 { font-size: 12px; }
p  { font-size: 11px; }
```

---

## Tools

### Preview PDF Generation

Use the admin panel or API:

```bash
curl -X GET "http://localhost:5000/api/resumes/1/download"
```

### Check Scaling Logs

Enable debug mode in environment:

```bash
PDF_DEBUG=true npm start
```

Then generate a PDF and check console for:
```
📏 Content Analysis:
   Content Height: 1050px
   A4 Height: 1123px
   📈 Expanding to fill: 1.0696
```

### Validate HTML

Use online validators:
- https://validator.w3.org/
- https://jigsaw.w3.org/css-validator/

---

## Performance Tips

1. **Minimize render recalculations**
   - Batch DOM modifications
   - Use CSS classes instead of inline styles
   - Avoid layout thrashing

2. **Optimize images**
   - Use appropriate formats (PNG for graphics, JPG for photos)
   - Compress before uploading
   - Use `<img>` not `background-image` (easier to size)

3. **Keep CSS minimal**
   - Remove unused styles
   - Avoid complex selectors
   - Use shorthand properties

4. **Test across browsers**
   - Chrome/Chromium (used by Puppeteer)
   - Firefox (different rendering)
   - Safari (different fonts)

---

**Remember:** The goal is a natural, flowing layout that gracefully adapts to fit exactly one A4 page without distortion or empty space.

