import type { ResumeData } from "@/components/resume-templates/types";
import type { ResumeTemplateTheme } from "@/components/resume-templates/shared";
import { getSummaryConfig } from "@/components/resume-templates/templatePolicy";
import { ResumeTypography } from "@/constants/resumeDesignSystem";

const hasText = (value?: string | null) => Boolean(value && value.trim());

interface ContactItem {
  label: string;
  value: string;
}

const getContactItems = (data: ResumeData): ContactItem[] => {
  const items: ContactItem[] = [];

  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });
  if (hasText(data.address)) items.push({ label: "Location", value: data.address });

  (data.socialLinks || []).forEach((link) => {
    if (hasText(link.url)) {
      items.push({ label: link.platform || "Link", value: link.url });
    }
  });

  return items;
};

export const ResumeContactRow = ({
  items,
  align = "left",
  color,
  compactMode: _compactMode = false,
  densityMode = "comfortable",
}: {
  items: ContactItem[];
  align?: "left" | "right";
  color: string;
  compactMode?: boolean;
  densityMode?: "comfortable" | "compact" | "ultra-compact";
}) => {
  void _compactMode;

  const gapX = densityMode === "ultra-compact" ? 10 : densityMode === "compact" ? 12 : 14;
  const gapY = densityMode === "ultra-compact" ? 4 : densityMode === "compact" ? 6 : 8;

  return (
    <div
      className="flex flex-wrap"
      style={{
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        maxWidth: align === "right" ? "390px" : "100%",
        gap: `${gapY}px ${gapX}px`,
      }}
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${item.value}-${index}`}
          className="resume-contact-item"
          style={{
            color,
            fontSize: "var(--resume-item-meta-size)",
            lineHeight: "var(--resume-line-height)",
          }}
        >
          {item.value}
        </span>
      ))}
    </div>
  );
};

const getSummaryText = (data: ResumeData) => getSummaryConfig(data).summaryText;

const getContactItemsForData = (data: ResumeData) => getContactItems(data);

export const ResumeHeader = ({
  data,
  theme,
  compactMode = false,
  densityMode = "comfortable",
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
  densityMode?: "comfortable" | "compact" | "ultra-compact";
}) => {
  const summaryText = getSummaryText(data);
  const contactItems = getContactItemsForData(data);

  const titleSize = "var(--resume-name-size)";
  const roleSize = "var(--resume-role-size)";

  return (
    <header
      className="break-inside-avoid"
      style={{
        background: theme.headerBand ? theme.palette.headerBg || theme.palette.page : "transparent",
        borderBottom: theme.headerDivider ? `1px solid ${theme.palette.border}` : "none",
        paddingBottom: theme.headerDivider ? "16px" : "0",
      }}
    >
      <div className={theme.headerLayout === "split" ? "flex items-end justify-between gap-8" : "space-y-2.5"}>
        <div className="min-w-0">
          <h1
            className="font-bold tracking-[0.02em] uppercase"
            style={{
              fontSize: titleSize,
              lineHeight: "var(--resume-line-height)",
              color: theme.palette.nameText || theme.palette.text,
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              className="mt-2 font-medium uppercase"
              style={{
                fontSize: roleSize,
                lineHeight: "var(--resume-line-height)",
                color: theme.palette.titleText || theme.palette.mutedText,
                letterSpacing: "0.08em",
              }}
            >
              {data.role}
            </p>
          ) : null}
        </div>

        {theme.showHeaderContact !== false && contactItems.length > 0 ? (
          <ResumeContactRow
            items={contactItems}
            align={theme.headerLayout === "split" ? "right" : "left"}
            color={theme.palette.mutedText}
            compactMode={compactMode}
            densityMode={densityMode}
          />
        ) : null}
      </div>

      {theme.summaryInHeader && hasText(summaryText) ? (
        <div className="mt-4">
          {theme.summaryStyle === "plain" ? (
            <p className="resume-body-copy">{summaryText}</p>
          ) : (
            <div className="resume-summary-box">
              <p className="resume-body-copy">{summaryText}</p>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
};

export default ResumeHeader;
