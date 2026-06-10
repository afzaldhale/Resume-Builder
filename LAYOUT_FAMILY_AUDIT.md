# Layout Family Audit

## Overview
This audit maps every existing production template (1–15) to a true layout family, identifies its header and column behavior, and captures the exact shared renderer dependencies that must remain stable during migration.

## True Layout Families
- ModernLayout
- SidebarLayout
- MinimalLayout
- ExecutiveLayout
- ProfessionalLayout

## Template Audit

```json
[
  {
    "templateId": 1,
    "layoutFamily": "ModernLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "default single-column flow using theme.mainSections and default section ordering",
    "themeCharacteristics": "clean corporate palette, orange accent, full-width heading bar, moderate page padding, standard typography scale",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 2,
    "layoutFamily": "SidebarLayout",
    "headerType": "split",
    "columnType": "two-column",
    "sidebarMode": "sidebar sections",
    "sectionPlacementStrategy": "sidebar contains skills/certifications/languages/strengths/hobbies, main contains summary/experience/education/projects/achievements/custom",
    "themeCharacteristics": "corporate blue sidebar, medium contrast text, split header, sidebar padding and accent soft background",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 3,
    "layoutFamily": "ModernLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "default single-column flow using theme.mainSections and default section ordering",
    "themeCharacteristics": "colored heading corporate palette, blue accent, full-width heading bar, moderate padding",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 4,
    "layoutFamily": "MinimalLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "default single-column flow with accent-led section headers",
    "themeCharacteristics": "left accent teal, label-bar heading variant, soft border, minimal decorative treatment",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 5,
    "layoutFamily": "SidebarLayout",
    "headerType": "split",
    "columnType": "two-column",
    "sidebarMode": "sidebar sections",
    "sectionPlacementStrategy": "sidebar contains languages/certifications/skills/strengths/hobbies, main contains summary/experience/education/projects/achievements/custom",
    "themeCharacteristics": "premium gray sidebar, underline headings, serif-like corporate typography, soft accent background",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 6,
    "layoutFamily": "ProfessionalLayout",
    "headerType": "stacked",
    "columnType": "two-column",
    "sidebarMode": "contact-only sidebar",
    "sectionPlacementStrategy": "sidebar contains only contact data, main contains summary/skills/experience/projects/education/certifications/languages/strengths/hobbies",
    "themeCharacteristics": "professional teal sidebar, contact-first profile behavior, compact main padding, dark sidebar tone",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "ResumeSidebarContactCard", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 7,
    "layoutFamily": "ModernLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "default single-column flow with warm accent and full-width heading bar",
    "themeCharacteristics": "muted coral corporate palette, strong accent, polished single-column rhythm, moderate padding",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 8,
    "layoutFamily": "ExecutiveLayout",
    "headerType": "split",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "compact single-column order with split header and underline heading style for ATS-friendly density",
    "themeCharacteristics": "compact ATS single palette, blue accent, tight spacing, split header with underline heading treatment",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 9,
    "layoutFamily": "SidebarLayout",
    "headerType": "split",
    "columnType": "two-column",
    "sidebarMode": "sidebar sections",
    "sectionPlacementStrategy": "sidebar contains personal/contact sections, main contains summary/experience/education/projects/achievements/custom",
    "themeCharacteristics": "premium charcoal sidebar, accent label bar, strong contrast, premium corporate look",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 10,
    "layoutFamily": "ModernLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "default single-column flow with top accent bar and business blue palette",
    "themeCharacteristics": "blue heading corporate, top accent bar, full-width heading bar, moderate padding",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 11,
    "layoutFamily": "SidebarLayout",
    "headerType": "split",
    "columnType": "two-column",
    "sidebarMode": "sidebar sections",
    "sectionPlacementStrategy": "sidebar contains skills/certifications/languages/strengths/hobbies, main contains summary/experience/education/projects/achievements/custom",
    "themeCharacteristics": "classic two column palette, serif heading font, understated blue accent, muted sidebar background",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 12,
    "layoutFamily": "ModernLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "default single-column flow with soft green palette and full-width heading bar",
    "themeCharacteristics": "soft green corporate palette, clean single-column layout, moderate padding, polished corporate typographic treatment",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 13,
    "layoutFamily": "SidebarLayout",
    "headerType": "split",
    "columnType": "two-column",
    "sidebarMode": "sidebar sections",
    "sectionPlacementStrategy": "sidebar contains languages/certifications/skills/strengths/hobbies, main contains summary/experience/education/projects/achievements/custom",
    "themeCharacteristics": "rose sidebar corporate palette, warm accent bar, feminine sidebar tone, soft background",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 14,
    "layoutFamily": "MinimalLayout",
    "headerType": "stacked",
    "columnType": "single",
    "sidebarMode": "none",
    "sectionPlacementStrategy": "simple single-column flow with left accent line and minimal decorative treatments",
    "themeCharacteristics": "minimal left accent palette, serif body font, low chrome, clean section hierarchy",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  },
  {
    "templateId": 15,
    "layoutFamily": "SidebarLayout",
    "headerType": "split",
    "columnType": "two-column",
    "sidebarMode": "sidebar sections",
    "sectionPlacementStrategy": "sidebar contains languages/certifications/skills/strengths/hobbies, main contains summary/experience/education/projects/achievements/custom",
    "themeCharacteristics": "corporate clean palette, underline headings, light sidebar surface, balanced spacing",
    "sharedRendererDependencies": ["ResumePage", "ResumeHeader", "ResumeTwoColumnLayout", "ResumeSidebar", "renderSections", "buildSectionMap", "ResumeTypography", "resolveTemplateTheme"]
  }
]
```

## Family Definitions

### ModernLayout
- Header structure: stacked, full-width heading bar or top accent bar.
- Section placement: sequential single-column mainSections.
- Sidebar behavior: none.
- Column system: single column.
- Spacing model: moderate padding and centered page content.
- Typography behavior: standard corporate scale with transparent accent and name color.
- ATS characteristics: high, simple DOM flow.
- Multi-page behavior: continuous page stacking with section-aware pagination.

### SidebarLayout
- Header structure: typically split with name/role and contact information separated.
- Section placement: sidebar handles contact/profile and secondary sections; main handles experience/education/projects.
- Sidebar behavior: sidebar sections or profile block with branded background.
- Column system: two-column fixed sidebar + fluid main.
- Spacing model: sidebar width + main padding is theme-driven.
- Typography behavior: balanced body and heading sizes; sidebar text often muted or bright.
- ATS characteristics: medium-high if sidebar remains semantic and not table-based.
- Multi-page behavior: main content paginates while sidebar remains static within each page shell.

### MinimalLayout
- Header structure: stacked minimal header with label bar or accent line.
- Section placement: direct linear section flow.
- Sidebar behavior: none.
- Column system: single column.
- Spacing model: low chrome, lighter borders, subtle accent details.
- Typography behavior: clean, reserved scale with low decorative weights.
- ATS characteristics: very high, minimalist markup.
- Multi-page behavior: stable, content-first pagination.

### ExecutiveLayout
- Header structure: split header with concise name/role and strong contact framing.
- Section placement: compact single-column flow with underline headings for densification.
- Sidebar behavior: none.
- Column system: single column.
- Spacing model: tighter spacing, more compact gaps.
- Typography behavior: smaller body sizes, optimized for page economy.
- ATS characteristics: highest, designed for resume scanners.
- Multi-page behavior: predictable page count with compact sections.

### ProfessionalLayout
- Header structure: stacked or split header with clean professional tone.
- Section placement: contact-only sidebar combined with broad main content.
- Sidebar behavior: contact-only sidebar with metadata and links.
- Column system: two-column (sidebar + main).
- Spacing model: custom sidebar padding and main column offsets.
- Typography behavior: conservative, professional scale.
- ATS characteristics: medium-high, should be validated for sidebar semantics.
- Multi-page behavior: uses stable shared pagination engine.
