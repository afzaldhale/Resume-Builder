import React from "react";
import type { ResumeData } from "./types";

type TemplateVariant =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

type Theme = {
  page: string;
  shell: string;
  header: string;
  headerPanel: string;
  headerName: string;
  headerRole: string;
  headerMeta: string;
  headerBadge: string;
  leftPanel: string;
  rightPanel: string;
  sectionTitle: string;
  sectionRule: string;
  text: string;
  muted: string;
  strong: string;
  accentText: string;
  accentSoft: string;
  accentBorder: string;
  tag: string;
  timeline: string;
  card: string;
  smallCard: string;
  skillBarTrack: string;
  skillBarFill: string;
  divider: string;
  bullet: string;
  summaryCard: string;
  summaryLabel: string;
  link: string;
};

type Layout = "top-band" | "left-sidebar" | "single-column" | "split-top" | "timeline";

const levelWidth: Record<string, string> = {
  Native: "100%",
  Fluent: "86%",
  Intermediate: "68%",
  Beginner: "48%",
};

const themes: Record<TemplateVariant, Theme> = {
  1: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-slate-900 text-white",
    headerPanel: "bg-white/10 border border-white/15",
    headerName: "text-[34px] font-semibold tracking-[-0.03em]",
    headerRole: "text-[13px] uppercase tracking-[0.28em] text-slate-200",
    headerMeta: "text-[9px] text-slate-200",
    headerBadge: "bg-blue-500/20 text-blue-100 border border-blue-300/20",
    leftPanel: "bg-white",
    rightPanel: "bg-slate-50/80",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-blue-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-blue-700",
    accentSoft: "bg-blue-50",
    accentBorder: "border-blue-200",
    tag: "bg-blue-50 text-blue-800 border border-blue-100",
    timeline: "border-blue-500",
    card: "rounded-[20px] border border-slate-200 bg-white",
    smallCard: "rounded-2xl border border-slate-200 bg-white",
    skillBarTrack: "bg-blue-100",
    skillBarFill: "bg-blue-600",
    divider: "border-slate-200",
    bullet: "bg-blue-600",
    summaryCard: "rounded-[22px] border border-blue-100 bg-blue-50/80",
    summaryLabel: "text-blue-700",
    link: "text-blue-700",
  },
  2: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-slate-50 text-slate-900",
    headerPanel: "bg-white border border-slate-200 shadow-sm",
    headerName: "text-[32px] font-semibold tracking-[-0.03em]",
    headerRole: "text-[12px] uppercase tracking-[0.28em] text-cyan-700",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    leftPanel: "bg-slate-900 text-white",
    rightPanel: "bg-white",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-cyan-500",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-cyan-700",
    accentSoft: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    tag: "bg-cyan-50 text-cyan-800 border border-cyan-100",
    timeline: "border-cyan-500",
    card: "rounded-[20px] border border-slate-200 bg-white",
    smallCard: "rounded-2xl border border-white/10 bg-white/5",
    skillBarTrack: "bg-white/10",
    skillBarFill: "bg-cyan-400",
    divider: "border-slate-200",
    bullet: "bg-cyan-400",
    summaryCard: "rounded-[22px] border border-cyan-100 bg-cyan-50/70",
    summaryLabel: "text-cyan-700",
    link: "text-cyan-700",
  },
  3: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-white text-slate-900 border-b border-slate-200",
    headerPanel: "bg-slate-50 border border-slate-200",
    headerName: "text-[30px] font-semibold tracking-[-0.03em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-slate-600",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-slate-100 text-slate-700 border border-slate-200",
    leftPanel: "bg-white",
    rightPanel: "bg-white",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.3em] text-slate-800",
    sectionRule: "bg-slate-400",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-slate-700",
    accentSoft: "bg-slate-100",
    accentBorder: "border-slate-200",
    tag: "bg-slate-100 text-slate-700 border border-slate-200",
    timeline: "border-slate-400",
    card: "rounded-none border-0 bg-white",
    smallCard: "rounded-xl border border-slate-200 bg-white",
    skillBarTrack: "bg-slate-200",
    skillBarFill: "bg-slate-600",
    divider: "border-slate-200",
    bullet: "bg-slate-500",
    summaryCard: "rounded-xl border border-slate-200 bg-slate-50",
    summaryLabel: "text-slate-700",
    link: "text-slate-700",
  },
  4: {
    page: "bg-[#fffdfa] text-stone-900",
    shell: "bg-[#fffdfa]",
    header: "bg-[#f7efe4] text-stone-900",
    headerPanel: "bg-white/80 border border-[#eadcc7]",
    headerName: "text-[34px] font-medium tracking-[-0.04em]",
    headerRole: "text-[12px] uppercase tracking-[0.32em] text-amber-700",
    headerMeta: "text-[9px] text-stone-600",
    headerBadge: "bg-white text-amber-800 border border-[#eadcc7]",
    leftPanel: "bg-[#fffdfa]",
    rightPanel: "bg-[#fcf8f1]",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-stone-900",
    sectionRule: "bg-amber-600",
    text: "text-[10px] leading-[1.6] text-stone-700",
    muted: "text-[8px] text-stone-500",
    strong: "text-[11px] font-semibold text-stone-900",
    accentText: "text-amber-800",
    accentSoft: "bg-amber-50",
    accentBorder: "border-amber-200",
    tag: "bg-white text-amber-900 border border-amber-200",
    timeline: "border-amber-500",
    card: "rounded-[24px] border border-[#eadcc7] bg-white/90",
    smallCard: "rounded-[18px] border border-[#eadcc7] bg-white/90",
    skillBarTrack: "bg-amber-100",
    skillBarFill: "bg-amber-600",
    divider: "border-[#eadcc7]",
    bullet: "bg-amber-600",
    summaryCard: "rounded-[24px] border border-[#eadcc7] bg-white/90",
    summaryLabel: "text-amber-800",
    link: "text-amber-800",
  },
  5: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-white text-slate-900 border-b-4 border-rose-600",
    headerPanel: "bg-rose-50 border border-rose-100",
    headerName: "text-[34px] font-bold tracking-[-0.04em]",
    headerRole: "text-[12px] uppercase tracking-[0.32em] text-rose-700",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-rose-50 text-rose-700 border border-rose-200",
    leftPanel: "bg-white",
    rightPanel: "bg-rose-50/40",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-rose-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-rose-700",
    accentSoft: "bg-rose-50",
    accentBorder: "border-rose-200",
    tag: "bg-rose-50 text-rose-800 border border-rose-100",
    timeline: "border-rose-500",
    card: "rounded-[20px] border border-rose-100 bg-white",
    smallCard: "rounded-2xl border border-rose-100 bg-white",
    skillBarTrack: "bg-rose-100",
    skillBarFill: "bg-rose-600",
    divider: "border-rose-100",
    bullet: "bg-rose-600",
    summaryCard: "rounded-[22px] border border-rose-100 bg-rose-50/70",
    summaryLabel: "text-rose-700",
    link: "text-rose-700",
  },
  6: {
    page: "bg-[#f7fbff] text-slate-900",
    shell: "bg-[#f7fbff]",
    header: "bg-slate-950 text-white",
    headerPanel: "bg-cyan-400/10 border border-cyan-300/15",
    headerName: "text-[33px] font-semibold tracking-[-0.04em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-cyan-200",
    headerMeta: "text-[9px] text-slate-300",
    headerBadge: "bg-cyan-400/10 text-cyan-100 border border-cyan-300/15",
    leftPanel: "bg-slate-950 text-white",
    rightPanel: "bg-[#f7fbff]",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-cyan-500",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-cyan-700",
    accentSoft: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    tag: "bg-cyan-50 text-cyan-900 border border-cyan-100",
    timeline: "border-cyan-500",
    card: "rounded-[20px] border border-cyan-100 bg-white",
    smallCard: "rounded-2xl border border-white/10 bg-white/5",
    skillBarTrack: "bg-white/10",
    skillBarFill: "bg-cyan-400",
    divider: "border-slate-200",
    bullet: "bg-cyan-400",
    summaryCard: "rounded-[22px] border border-cyan-100 bg-white",
    summaryLabel: "text-cyan-700",
    link: "text-cyan-700",
  },
  7: {
    page: "bg-[#fbfaf6] text-neutral-900",
    shell: "bg-[#fbfaf6]",
    header: "bg-neutral-950 text-white",
    headerPanel: "bg-amber-400/10 border border-amber-300/15",
    headerName: "text-[34px] font-semibold tracking-[-0.05em]",
    headerRole: "text-[12px] uppercase tracking-[0.34em] text-amber-200",
    headerMeta: "text-[9px] text-neutral-300",
    headerBadge: "bg-amber-400/10 text-amber-100 border border-amber-300/15",
    leftPanel: "bg-[#fbfaf6]",
    rightPanel: "bg-white",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-900",
    sectionRule: "bg-amber-500",
    text: "text-[10px] leading-[1.6] text-neutral-700",
    muted: "text-[8px] text-neutral-500",
    strong: "text-[11px] font-semibold text-neutral-900",
    accentText: "text-amber-700",
    accentSoft: "bg-amber-50",
    accentBorder: "border-amber-200",
    tag: "bg-white text-amber-900 border border-amber-200",
    timeline: "border-amber-500",
    card: "rounded-[22px] border border-amber-100 bg-white",
    smallCard: "rounded-2xl border border-amber-100 bg-white",
    skillBarTrack: "bg-amber-100",
    skillBarFill: "bg-amber-500",
    divider: "border-amber-100",
    bullet: "bg-amber-500",
    summaryCard: "rounded-[22px] border border-amber-100 bg-white",
    summaryLabel: "text-amber-700",
    link: "text-amber-700",
  },
  8: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-slate-100 text-slate-900",
    headerPanel: "bg-white border border-slate-200",
    headerName: "text-[31px] font-semibold tracking-[-0.03em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-sky-700",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-sky-50 text-sky-700 border border-sky-100",
    leftPanel: "bg-white",
    rightPanel: "bg-slate-50",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-sky-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-sky-700",
    accentSoft: "bg-sky-50",
    accentBorder: "border-sky-100",
    tag: "bg-white text-sky-800 border border-sky-100",
    timeline: "border-sky-500",
    card: "rounded-[18px] border border-slate-200 bg-white",
    smallCard: "rounded-2xl border border-slate-200 bg-white",
    skillBarTrack: "bg-sky-100",
    skillBarFill: "bg-sky-600",
    divider: "border-slate-200",
    bullet: "bg-sky-600",
    summaryCard: "rounded-[18px] border border-slate-200 bg-white",
    summaryLabel: "text-sky-700",
    link: "text-sky-700",
  },
  9: {
    page: "bg-white text-slate-900",
    shell: "bg-gradient-to-br from-white via-[#fdf7ff] to-[#eef7ff]",
    header: "bg-transparent text-slate-900",
    headerPanel: "bg-white/70 border border-white/80 backdrop-blur-sm",
    headerName: "text-[33px] font-semibold tracking-[-0.05em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-fuchsia-700",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-white/70 text-fuchsia-700 border border-fuchsia-100",
    leftPanel: "bg-white/60",
    rightPanel: "bg-white/65",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-fuchsia-500",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-fuchsia-700",
    accentSoft: "bg-fuchsia-50",
    accentBorder: "border-fuchsia-100",
    tag: "bg-white text-fuchsia-800 border border-fuchsia-100",
    timeline: "border-fuchsia-500",
    card: "rounded-[24px] border border-white/80 bg-white/80 backdrop-blur-sm",
    smallCard: "rounded-[18px] border border-white/80 bg-white/75 backdrop-blur-sm",
    skillBarTrack: "bg-fuchsia-100",
    skillBarFill: "bg-fuchsia-500",
    divider: "border-white/80",
    bullet: "bg-fuchsia-500",
    summaryCard: "rounded-[24px] border border-white/80 bg-white/80 backdrop-blur-sm",
    summaryLabel: "text-fuchsia-700",
    link: "text-fuchsia-700",
  },
  10: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-white text-slate-900 border-b border-slate-300",
    headerPanel: "bg-slate-50 border border-slate-200",
    headerName: "text-[32px] font-semibold tracking-[-0.03em]",
    headerRole: "text-[12px] uppercase tracking-[0.32em] text-slate-700",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-slate-100 text-slate-700 border border-slate-200",
    leftPanel: "bg-white",
    rightPanel: "bg-white",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900",
    sectionRule: "bg-slate-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-slate-700",
    accentSoft: "bg-slate-100",
    accentBorder: "border-slate-200",
    tag: "bg-slate-100 text-slate-700 border border-slate-200",
    timeline: "border-slate-500",
    card: "rounded-none border-0 bg-white",
    smallCard: "rounded-xl border border-slate-200 bg-white",
    skillBarTrack: "bg-slate-200",
    skillBarFill: "bg-slate-600",
    divider: "border-slate-300",
    bullet: "bg-slate-500",
    summaryCard: "rounded-xl border border-slate-200 bg-slate-50",
    summaryLabel: "text-slate-700",
    link: "text-slate-700",
  },
  11: {
    page: "bg-[#fcfcfd] text-slate-900",
    shell: "bg-[#fcfcfd]",
    header: "bg-indigo-950 text-white",
    headerPanel: "bg-white/10 border border-white/15",
    headerName: "text-[34px] font-semibold tracking-[-0.05em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-indigo-200",
    headerMeta: "text-[9px] text-indigo-100",
    headerBadge: "bg-white/10 text-indigo-100 border border-white/10",
    leftPanel: "bg-[#fcfcfd]",
    rightPanel: "bg-white",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-indigo-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-indigo-700",
    accentSoft: "bg-indigo-50",
    accentBorder: "border-indigo-100",
    tag: "bg-indigo-50 text-indigo-800 border border-indigo-100",
    timeline: "border-indigo-500",
    card: "rounded-[20px] border border-indigo-100 bg-white",
    smallCard: "rounded-2xl border border-indigo-100 bg-white",
    skillBarTrack: "bg-indigo-100",
    skillBarFill: "bg-indigo-600",
    divider: "border-indigo-100",
    bullet: "bg-indigo-600",
    summaryCard: "rounded-[22px] border border-indigo-100 bg-indigo-50/70",
    summaryLabel: "text-indigo-700",
    link: "text-indigo-700",
  },
  12: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-slate-900 text-white",
    headerPanel: "bg-emerald-400/10 border border-emerald-300/15",
    headerName: "text-[33px] font-semibold tracking-[-0.04em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-emerald-200",
    headerMeta: "text-[9px] text-slate-200",
    headerBadge: "bg-emerald-400/10 text-emerald-100 border border-emerald-300/15",
    leftPanel: "bg-white",
    rightPanel: "bg-slate-50",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-emerald-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-emerald-700",
    accentSoft: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    tag: "bg-emerald-50 text-emerald-800 border border-emerald-100",
    timeline: "border-emerald-500",
    card: "rounded-[18px] border border-slate-200 bg-white",
    smallCard: "rounded-2xl border border-slate-200 bg-white",
    skillBarTrack: "bg-emerald-100",
    skillBarFill: "bg-emerald-600",
    divider: "border-slate-200",
    bullet: "bg-emerald-600",
    summaryCard: "rounded-[18px] border border-slate-200 bg-white",
    summaryLabel: "text-emerald-700",
    link: "text-emerald-700",
  },
  13: {
    page: "bg-white text-slate-900",
    shell: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900",
    header: "bg-transparent text-white",
    headerPanel: "bg-white/10 border border-white/10",
    headerName: "text-[35px] font-semibold tracking-[-0.05em]",
    headerRole: "text-[12px] uppercase tracking-[0.32em] text-cyan-200",
    headerMeta: "text-[9px] text-slate-200",
    headerBadge: "bg-white/10 text-cyan-100 border border-white/10",
    leftPanel: "bg-white",
    rightPanel: "bg-white/95",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-cyan-500",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-cyan-700",
    accentSoft: "bg-cyan-50",
    accentBorder: "border-cyan-100",
    tag: "bg-cyan-50 text-cyan-800 border border-cyan-100",
    timeline: "border-cyan-500",
    card: "rounded-[24px] border border-white/10 bg-white/95",
    smallCard: "rounded-[20px] border border-white/10 bg-white/95",
    skillBarTrack: "bg-cyan-100",
    skillBarFill: "bg-cyan-600",
    divider: "border-slate-200",
    bullet: "bg-cyan-500",
    summaryCard: "rounded-[24px] border border-cyan-100 bg-cyan-50/80",
    summaryLabel: "text-cyan-700",
    link: "text-cyan-700",
  },
  14: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-slate-50 text-slate-900",
    headerPanel: "bg-white border border-slate-200",
    headerName: "text-[31px] font-semibold tracking-[-0.03em]",
    headerRole: "text-[12px] uppercase tracking-[0.3em] text-teal-700",
    headerMeta: "text-[9px] text-slate-600",
    headerBadge: "bg-teal-50 text-teal-700 border border-teal-100",
    leftPanel: "bg-white",
    rightPanel: "bg-slate-50",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900",
    sectionRule: "bg-teal-600",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-teal-700",
    accentSoft: "bg-teal-50",
    accentBorder: "border-teal-100",
    tag: "bg-white text-teal-800 border border-teal-100",
    timeline: "border-teal-500",
    card: "rounded-[18px] border border-slate-200 bg-white",
    smallCard: "rounded-2xl border border-slate-200 bg-white",
    skillBarTrack: "bg-teal-100",
    skillBarFill: "bg-teal-600",
    divider: "border-slate-200",
    bullet: "bg-teal-600",
    summaryCard: "rounded-[18px] border border-slate-200 bg-white",
    summaryLabel: "text-teal-700",
    link: "text-teal-700",
  },
  15: {
    page: "bg-white text-slate-900",
    shell: "bg-white",
    header: "bg-slate-950 text-white",
    headerPanel: "bg-emerald-400/10 border border-emerald-300/15",
    headerName: "text-[35px] font-semibold tracking-[-0.05em]",
    headerRole: "text-[12px] uppercase tracking-[0.34em] text-emerald-200",
    headerMeta: "text-[9px] text-slate-200",
    headerBadge: "bg-emerald-400/10 text-emerald-100 border border-emerald-300/15",
    leftPanel: "bg-white",
    rightPanel: "bg-slate-50",
    sectionTitle: "text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900",
    sectionRule: "bg-emerald-500",
    text: "text-[10px] leading-[1.55] text-slate-700",
    muted: "text-[8px] text-slate-500",
    strong: "text-[11px] font-semibold text-slate-900",
    accentText: "text-emerald-700",
    accentSoft: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    tag: "bg-white text-emerald-800 border border-emerald-100",
    timeline: "border-emerald-500",
    card: "rounded-[22px] border border-slate-200 bg-white",
    smallCard: "rounded-2xl border border-slate-200 bg-white",
    skillBarTrack: "bg-emerald-100",
    skillBarFill: "bg-emerald-500",
    divider: "border-slate-200",
    bullet: "bg-emerald-500",
    summaryCard: "rounded-[22px] border border-slate-200 bg-white",
    summaryLabel: "text-emerald-700",
    link: "text-emerald-700",
  },
};

const variantMeta: Record<
  TemplateVariant,
  { layout: Layout; summaryTitle: string; experienceTitle: string; skillsTitle: string }
> = {
  1: { layout: "top-band", summaryTitle: "Executive Summary", experienceTitle: "Professional Experience", skillsTitle: "Core Strengths" },
  2: { layout: "left-sidebar", summaryTitle: "Professional Summary", experienceTitle: "Experience", skillsTitle: "Highlights" },
  3: { layout: "single-column", summaryTitle: "Professional Summary", experienceTitle: "Experience", skillsTitle: "Skills" },
  4: { layout: "split-top", summaryTitle: "Profile", experienceTitle: "Experience", skillsTitle: "Competencies" },
  5: { layout: "top-band", summaryTitle: "Professional Summary", experienceTitle: "Experience", skillsTitle: "Expertise" },
  6: { layout: "left-sidebar", summaryTitle: "Tech Profile", experienceTitle: "Experience", skillsTitle: "Stack" },
  7: { layout: "split-top", summaryTitle: "Executive Summary", experienceTitle: "Experience", skillsTitle: "Capabilities" },
  8: { layout: "top-band", summaryTitle: "Analyst Summary", experienceTitle: "Experience", skillsTitle: "Specialties" },
  9: { layout: "split-top", summaryTitle: "Creative Summary", experienceTitle: "Experience", skillsTitle: "Toolkit" },
  10: { layout: "single-column", summaryTitle: "Professional Summary", experienceTitle: "Experience", skillsTitle: "Core Skills" },
  11: { layout: "top-band", summaryTitle: "Leadership Summary", experienceTitle: "Leadership Experience", skillsTitle: "Leadership Toolkit" },
  12: { layout: "timeline", summaryTitle: "Career Summary", experienceTitle: "Career Timeline", skillsTitle: "Skills" },
  13: { layout: "split-top", summaryTitle: "Premium Summary", experienceTitle: "Experience", skillsTitle: "Key Strengths" },
  14: { layout: "top-band", summaryTitle: "Professional Summary", experienceTitle: "Experience", skillsTitle: "Skills" },
  15: { layout: "left-sidebar", summaryTitle: "Executive Summary", experienceTitle: "Experience", skillsTitle: "Boardroom Skills" },
};

const getSummary = (data: ResumeData) =>
  data.candidateType === "fresher"
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

const sectionTitleNode = (title: string, theme: Theme) => (
  <div className="mb-2.5 flex items-center gap-3">
    <h2 className={theme.sectionTitle}>{title}</h2>
    <div className={`h-px flex-1 ${theme.sectionRule}`} />
  </div>
);

const bullets = (items: string[] | undefined, theme: Theme) =>
  items && items.length > 0 ? (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex items-start gap-2">
          <span className={`mt-[5px] h-1.5 w-1.5 rounded-full ${theme.bullet}`} />
          <p className={`${theme.text} break-words`}>{item}</p>
        </div>
      ))}
    </div>
  ) : null;

const description = (value: string | undefined, theme: Theme, className = "") =>
  value ? (
    <p className={`${theme.text} whitespace-pre-line break-words ${className}`.trim()}>{value}</p>
  ) : null;

const renderSummary = (summary: string | undefined, label: string, theme: Theme) =>
  summary ? (
    <section className={`page-safe p-4 ${theme.summaryCard}`}>
      <p className={`mb-1 ${theme.sectionTitle} ${theme.summaryLabel}`}>{label}</p>
      {description(summary, theme)}
    </section>
  ) : null;

const renderExperience = (
  data: ResumeData,
  theme: Theme,
  title: string,
  asTimeline = false,
) =>
  data.experience && data.experience.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode(title, theme)}
      <div className="space-y-3">
        {data.experience.map((item, index) => (
          <article
            key={`${item.role}-${item.company}-${index}`}
            className={asTimeline ? "relative pl-4" : ""}
          >
            {asTimeline ? (
              <>
                <span className={`absolute left-0 top-1 h-full border-l-2 ${theme.timeline}`} />
                <span className={`absolute left-[-3px] top-1.5 h-2 w-2 rounded-full ${theme.bullet}`} />
              </>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className={`${theme.strong} break-words`}>{item.role}</h3>
                {item.company ? (
                  <p className={`mt-0.5 text-[9px] font-medium ${theme.accentText} break-words`}>
                    {item.company}
                  </p>
                ) : null}
              </div>
              <p className={`${theme.muted} whitespace-nowrap`}>
                {[item.startDate, item.endDate].filter(Boolean).join(" - ")}
              </p>
            </div>
            {description(item.description, theme, "mt-1")}
          </article>
        ))}
      </div>
    </section>
  ) : null;

const renderEducation = (data: ResumeData, theme: Theme) =>
  data.education && data.education.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode("Education", theme)}
      <div className="space-y-2.5">
        {data.education.map((item, index) => (
          <article key={`${item.degree}-${item.school}-${index}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className={`${theme.strong} break-words`}>{item.degree}</h3>
                <p className={`${theme.text} ${theme.accentText} break-words`}>{item.school}</p>
              </div>
              <p className={`${theme.muted} whitespace-nowrap`}>
                {[item.startYear, item.endYear].filter(Boolean).join(" - ")}
              </p>
            </div>
            {item.gpa ? <p className={`${theme.muted} mt-0.5`}>GPA: {item.gpa}</p> : null}
          </article>
        ))}
      </div>
    </section>
  ) : null;

const renderProjects = (data: ResumeData, theme: Theme, withCards = false) =>
  data.projects && data.projects.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode("Projects", theme)}
      <div className="space-y-3">
        {data.projects.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            className={withCards ? `p-3 ${theme.smallCard}` : ""}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className={`${theme.strong} break-words`}>{item.name}</h3>
              {item.link ? (
                <a href={item.link} className={`text-[8px] font-medium ${theme.link}`}>
                  View
                </a>
              ) : null}
            </div>
            {description(item.description, theme, "mt-1")}
            {item.technologies && item.technologies.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.technologies.map((tech, techIndex) => (
                  <span
                    key={`${tech}-${techIndex}`}
                    className={`rounded-full px-2 py-1 text-[8px] ${theme.tag}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  ) : null;

const renderSkills = (data: ResumeData, theme: Theme, title: string, bars = false) =>
  data.skills && data.skills.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode(title, theme)}
      {bars ? (
        <div className="space-y-2">
          {data.skills.map((skill, index) => (
            <div key={`${skill}-${index}`}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className={`${theme.text} break-words`}>{skill}</p>
                <span className={theme.muted}>Core</span>
              </div>
              <div className={`h-1.5 rounded-full ${theme.skillBarTrack}`}>
                <div className={`h-1.5 rounded-full ${theme.skillBarFill}`} style={{ width: `${88 - index * 4}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill, index) => (
            <span key={`${skill}-${index}`} className={`rounded-full px-2.5 py-1 text-[8px] ${theme.tag}`}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  ) : null;

const renderLanguages = (data: ResumeData, theme: Theme, bars = false) =>
  data.languages && data.languages.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode("Languages", theme)}
      <div className="space-y-2">
        {data.languages.map((item, index) => (
          <div key={`${item.language}-${index}`}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <p className={`${theme.text} break-words`}>{item.language}</p>
              <span className={theme.muted}>{item.level}</span>
            </div>
            {bars ? (
              <div className={`h-1.5 rounded-full ${theme.skillBarTrack}`}>
                <div
                  className={`h-1.5 rounded-full ${theme.skillBarFill}`}
                  style={{ width: levelWidth[item.level] || "60%" }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  ) : null;

const renderCertifications = (data: ResumeData, theme: Theme) =>
  data.certifications && data.certifications.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode("Certifications", theme)}
      <div className="space-y-2.5">
        {data.certifications.map((item, index) => (
          <article key={`${item.name}-${index}`}>
            <h3 className={`${theme.strong} break-words`}>{item.name}</h3>
            <p className={`${theme.text} break-words`}>
              {item.issuer}
              {item.year ? ` | ${item.year}` : ""}
            </p>
            {item.credentialId ? <p className={theme.muted}>ID: {item.credentialId}</p> : null}
          </article>
        ))}
      </div>
    </section>
  ) : null;

const renderLinks = (data: ResumeData, theme: Theme) =>
  data.socialLinks && data.socialLinks.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode("Links", theme)}
      <div className="space-y-1.5">
        {data.socialLinks.map((item, index) => (
          <div key={`${item.platform}-${index}`}>
            <p className={`${theme.strong} text-[9px]`}>{item.platform}</p>
            <a href={item.url} className={`text-[9px] break-words ${theme.link}`}>
              {item.url}
            </a>
          </div>
        ))}
      </div>
    </section>
  ) : null;

const renderCustomSections = (data: ResumeData, theme: Theme) =>
  data.customSections && data.customSections.length > 0 ? (
    <>
      {data.customSections.map((section, index) => (
        <section className="page-safe" key={`${section.title}-${index}`}>
          {sectionTitleNode(section.title, theme)}
          {section.description ? description(section.description, theme) : null}
          {section.items && section.items.length > 0 ? (
            <div className={section.description ? "mt-1.5" : ""}>{bullets(section.items, theme)}</div>
          ) : null}
          {section.date ? <p className={`${theme.muted} mt-1`}>{section.date}</p> : null}
        </section>
      ))}
    </>
  ) : null;

const renderReferences = (data: ResumeData, theme: Theme) =>
  data.references && data.references.length > 0 ? (
    <section className="page-safe">
      {sectionTitleNode("References", theme)}
      {bullets(data.references, theme)}
    </section>
  ) : null;

const renderFresherPanels = (data: ResumeData, theme: Theme) => (
  <>
    {data.strengths && data.strengths.length > 0 ? (
      <section className="page-safe">
        {sectionTitleNode("Strengths", theme)}
        {bullets(data.strengths, theme)}
      </section>
    ) : null}
    {data.hobbies && data.hobbies.length > 0 ? (
      <section className="page-safe">
        {sectionTitleNode("Interests", theme)}
        {bullets(data.hobbies, theme)}
      </section>
    ) : null}
  </>
);

const Header = ({
  data,
  theme,
  variant,
}: {
  data: ResumeData;
  theme: Theme;
  variant: TemplateVariant;
}) => (
  <header className={`page-safe px-8 py-7 ${theme.header}`}>
    <div
      className={
        variant === 3 || variant === 10
          ? "flex items-end justify-between gap-6"
          : "flex items-start justify-between gap-6"
      }
    >
      <div className="min-w-0 flex-1">
        <h1 className={`${theme.headerName} break-words leading-none`}>{data.fullName || "Your Name"}</h1>
        <p className={`mt-2 break-words ${theme.headerRole}`}>{data.role || "Professional Title"}</p>
      </div>
      <div className={`min-w-[210px] rounded-2xl px-4 py-3 ${theme.headerPanel}`}>
        <div className="space-y-1.5">
          {data.email ? <p className={`${theme.headerMeta} break-words`}>{data.email}</p> : null}
          {data.phone ? <p className={theme.headerMeta}>{data.phone}</p> : null}
          {data.address ? <p className={`${theme.headerMeta} break-words`}>{data.address}</p> : null}
        </div>
      </div>
    </div>
    {data.socialLinks && data.socialLinks.length > 0 ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {data.socialLinks.map((item, index) => (
          <span key={`${item.platform}-${index}`} className={`rounded-full px-3 py-1 text-[8px] ${theme.headerBadge}`}>
            {item.platform}
          </span>
        ))}
      </div>
    ) : null}
  </header>
);

const TopBandLayout = ({
  data,
  variant,
}: {
  data: ResumeData;
  variant: TemplateVariant;
}) => {
  const theme = themes[variant];
  const meta = variantMeta[variant];
  const summaryTitle = data.candidateType === "fresher" ? "Career Objective" : meta.summaryTitle;

  return (
    <div className={`h-[1123px] w-[794px] overflow-hidden font-sans ${theme.page} ${theme.shell}`}>
      <Header data={data} theme={theme} variant={variant} />
      <div className="grid h-[calc(1123px-152px)] grid-cols-[1.7fr_1fr] gap-6 px-8 py-6">
        <div className="space-y-4">
          {renderSummary(getSummary(data), summaryTitle, theme)}
          {renderExperience(data, theme, data.candidateType === "fresher" ? "Internships" : meta.experienceTitle)}
          {renderProjects(data, theme, variant === 1 || variant === 11)}
          {renderCustomSections(data, theme)}
        </div>
        <div className={`space-y-4 border-l pl-6 ${theme.divider}`}>
          {renderSkills(data, theme, meta.skillsTitle, variant === 8)}
          {renderEducation(data, theme)}
          {renderCertifications(data, theme)}
          {renderLanguages(data, theme, variant === 8)}
          {renderLinks(data, theme)}
          {data.candidateType === "fresher" ? renderFresherPanels(data, theme) : null}
          {renderReferences(data, theme)}
        </div>
      </div>
    </div>
  );
};

const LeftSidebarLayout = ({
  data,
  variant,
}: {
  data: ResumeData;
  variant: TemplateVariant;
}) => {
  const theme = themes[variant];
  const meta = variantMeta[variant];
  const summaryTitle = data.candidateType === "fresher" ? "Career Objective" : meta.summaryTitle;
  const sidebarTheme =
    variant === 2 || variant === 6
      ? {
          ...theme,
          sectionTitle: "text-[10px] font-bold uppercase tracking-[0.28em] text-white",
          sectionRule: "bg-white/15",
          text: "text-[10px] leading-[1.55] text-slate-200",
          muted: "text-[8px] text-slate-400",
          strong: "text-[11px] font-semibold text-white",
          tag: "bg-white/10 text-white border border-white/10",
          link: variant === 2 ? "text-cyan-300" : "text-cyan-300",
          accentText: "text-cyan-300",
        }
      : theme;

  return (
    <div className={`h-[1123px] w-[794px] overflow-hidden font-sans ${theme.page} ${theme.shell}`}>
      <div className="grid h-full grid-cols-[255px_1fr]">
        <aside className={`px-6 py-7 ${theme.leftPanel}`}>
          <div className="page-safe mb-6">
            <h1 className={`${theme.headerName} break-words leading-none`}>{data.fullName || "Your Name"}</h1>
            <p className={`mt-2 break-words ${theme.headerRole}`}>{data.role || "Professional Title"}</p>
          </div>
          <div className="space-y-4">
            <section className="page-safe">
              {sectionTitleNode("Contact", sidebarTheme)}
              <div className="space-y-1.5">
                {data.email ? <p className={`${sidebarTheme.text} break-words`}>{data.email}</p> : null}
                {data.phone ? <p className={sidebarTheme.text}>{data.phone}</p> : null}
                {data.address ? <p className={`${sidebarTheme.text} break-words`}>{data.address}</p> : null}
              </div>
            </section>
            {renderSkills(data, sidebarTheme, meta.skillsTitle, true)}
            {renderLanguages(data, sidebarTheme, true)}
            {renderCertifications(data, sidebarTheme)}
            {renderLinks(data, sidebarTheme)}
            {data.candidateType === "fresher" ? renderFresherPanels(data, sidebarTheme) : null}
          </div>
        </aside>
        <main className={`px-7 py-7 ${theme.rightPanel}`}>
          <div className="space-y-4">
            {renderSummary(getSummary(data), summaryTitle, theme)}
            {renderExperience(data, theme, data.candidateType === "fresher" ? "Internships" : meta.experienceTitle, variant === 15)}
            {renderProjects(data, theme, true)}
            <div className="grid grid-cols-2 gap-5">
              {renderEducation(data, theme)}
              {renderReferences(data, theme)}
            </div>
            {renderCustomSections(data, theme)}
          </div>
        </main>
      </div>
    </div>
  );
};

const SingleColumnLayout = ({
  data,
  variant,
}: {
  data: ResumeData;
  variant: TemplateVariant;
}) => {
  const theme = themes[variant];
  const meta = variantMeta[variant];
  const summaryTitle = data.candidateType === "fresher" ? "Career Objective" : meta.summaryTitle;

  return (
    <div className={`h-[1123px] w-[794px] overflow-hidden font-sans ${theme.page} ${theme.shell}`}>
      <Header data={data} theme={theme} variant={variant} />
      <main className="grid h-[calc(1123px-150px)] grid-cols-1 gap-4 px-8 py-6">
        {renderSummary(getSummary(data), summaryTitle, theme)}
        <div className="grid grid-cols-[1.55fr_1fr] gap-6">
          <div className="space-y-4">
            {renderExperience(data, theme, data.candidateType === "fresher" ? "Internships" : meta.experienceTitle)}
            {renderProjects(data, theme)}
            {renderCustomSections(data, theme)}
          </div>
          <div className={`space-y-4 border-l pl-6 ${theme.divider}`}>
            {renderSkills(data, theme, meta.skillsTitle)}
            {renderEducation(data, theme)}
            {renderLanguages(data, theme)}
            {renderCertifications(data, theme)}
            {renderLinks(data, theme)}
            {data.candidateType === "fresher" ? renderFresherPanels(data, theme) : null}
            {renderReferences(data, theme)}
          </div>
        </div>
      </main>
    </div>
  );
};

const SplitTopLayout = ({
  data,
  variant,
}: {
  data: ResumeData;
  variant: TemplateVariant;
}) => {
  const theme = themes[variant];
  const meta = variantMeta[variant];
  const summaryTitle = data.candidateType === "fresher" ? "Career Objective" : meta.summaryTitle;

  return (
    <div className={`h-[1123px] w-[794px] overflow-hidden font-sans ${theme.page} ${theme.shell}`}>
      <div className="px-8 py-7">
        <div className={`page-safe rounded-[28px] px-7 py-6 ${theme.header}`}>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <h1 className={`${theme.headerName} break-words leading-none`}>{data.fullName || "Your Name"}</h1>
              <p className={`mt-2 break-words ${theme.headerRole}`}>{data.role || "Professional Title"}</p>
            </div>
            <div className={`min-w-[220px] rounded-2xl px-4 py-3 ${theme.headerPanel}`}>
              <div className="space-y-1.5">
                {data.email ? <p className={`${theme.headerMeta} break-words`}>{data.email}</p> : null}
                {data.phone ? <p className={theme.headerMeta}>{data.phone}</p> : null}
                {data.address ? <p className={`${theme.headerMeta} break-words`}>{data.address}</p> : null}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[1.2fr_1.05fr] gap-5">
          <div className="space-y-4">
            {renderSummary(getSummary(data), summaryTitle, theme)}
            {renderExperience(data, theme, data.candidateType === "fresher" ? "Internships" : meta.experienceTitle)}
            {renderProjects(data, theme, true)}
          </div>
          <div className="space-y-4">
            {renderSkills(data, theme, meta.skillsTitle)}
            {renderEducation(data, theme)}
            {renderLanguages(data, theme, variant === 9)}
            {renderCertifications(data, theme)}
            {renderLinks(data, theme)}
            {data.candidateType === "fresher" ? renderFresherPanels(data, theme) : null}
            {renderReferences(data, theme)}
            {renderCustomSections(data, theme)}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineLayout = ({
  data,
  variant,
}: {
  data: ResumeData;
  variant: TemplateVariant;
}) => {
  const theme = themes[variant];
  const meta = variantMeta[variant];
  const summaryTitle = data.candidateType === "fresher" ? "Career Objective" : meta.summaryTitle;

  return (
    <div className={`h-[1123px] w-[794px] overflow-hidden font-sans ${theme.page} ${theme.shell}`}>
      <Header data={data} theme={theme} variant={variant} />
      <div className="grid h-[calc(1123px-150px)] grid-cols-[1.45fr_0.95fr] gap-6 px-8 py-6">
        <div className="space-y-4">
          {renderSummary(getSummary(data), summaryTitle, theme)}
          {renderExperience(data, theme, data.candidateType === "fresher" ? "Internships" : meta.experienceTitle, true)}
          {renderProjects(data, theme)}
          {renderCustomSections(data, theme)}
        </div>
        <div className={`space-y-4 border-l pl-6 ${theme.divider}`}>
          {renderSkills(data, theme, meta.skillsTitle)}
          {renderEducation(data, theme)}
          {renderCertifications(data, theme)}
          {renderLanguages(data, theme, true)}
          {renderLinks(data, theme)}
          {data.candidateType === "fresher" ? renderFresherPanels(data, theme) : null}
          {renderReferences(data, theme)}
        </div>
      </div>
    </div>
  );
};

export const TemplateCore = ({
  data,
  variant,
}: {
  data: ResumeData;
  variant: TemplateVariant;
}) => {
  switch (variantMeta[variant].layout) {
    case "left-sidebar":
      return <LeftSidebarLayout data={data} variant={variant} />;
    case "single-column":
      return <SingleColumnLayout data={data} variant={variant} />;
    case "split-top":
      return <SplitTopLayout data={data} variant={variant} />;
    case "timeline":
      return <TimelineLayout data={data} variant={variant} />;
    case "top-band":
    default:
      return <TopBandLayout data={data} variant={variant} />;
  }
};

export default TemplateCore;
