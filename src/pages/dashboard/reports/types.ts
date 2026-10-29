export type ReportCategory =
  | "mensuel"
  | "qualite"
  | "eco"
  | "financier"
  | "technique";

export interface ReportItem {
  readonly id: string;
  readonly title: string;
  readonly period: string;
  readonly category: ReportCategory;
  readonly categoryLabel: string;
  readonly author: string;
  readonly dateFormatted: string;
  readonly fileSize: string;
  readonly format: "PDF" | "CSV" | "XLSX";
  readonly summary: string;
  readonly metrics: {
    readonly interventionsCount?: number;
    readonly qualityScore?: string;
    readonly ecoScore?: string;
    readonly hoursWorked?: number;
  };
}

export interface ReportKpiData {
  readonly totalInterventions: number;
  readonly interventionsChange: string;
  readonly hoursWorked: number;
  readonly punctualityRate: string;
  readonly qualityScore: string;
  readonly complaintsCount: number;
  readonly ecoIndex: string;
  readonly ecoProductRatio: string;
}

export interface SectorDistribution {
  readonly sector: string;
  readonly percentage: number;
  readonly count: number;
  readonly color: string;
}

