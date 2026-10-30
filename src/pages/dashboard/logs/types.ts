export type LogType = "audit" | "technical";

export type LogLevel = "info" | "warning" | "error" | "critical";

export type LogResult = "success" | "failure";

export type LogCategory =
  | "security"
  | "content"
  | "contact"
  | "technical"
  | "system";

export interface LogItem {
  readonly id: string;
  readonly timestamp: string;
  readonly type: LogType;
  readonly category: LogCategory;
  readonly level: LogLevel;
  readonly user: string;
  readonly userEmail?: string;
  readonly action: string;
  readonly target: string;
  readonly ipAddress: string;
  readonly result: LogResult;
  readonly details: string;
  readonly metadata?: {
    readonly httpStatus?: number;
    readonly errorStack?: string;
    readonly linesImported?: number;
    readonly errorsCount?: number;
    readonly oldPrice?: string;
    readonly newPrice?: string;
    readonly attemptsCount?: number;
    readonly isSpamBlocked?: boolean;
    readonly targetRoute?: string;
  };
}

export interface LogStats {
  readonly totalAudit: number;
  readonly totalTechnical: number;
  readonly totalWarnings: number;
  readonly totalErrors: number;
  readonly blockedAccounts: number;
  readonly uptimeRate: string;
}

export type LogTypeFilter = "all" | "audit" | "technical";
export type LogLevelFilter = "all" | "info" | "warning" | "error" | "critical";
export type LogResultFilter = "all" | "success" | "failure";

