export class RateLimitRule {
  constructor(limit: number, timeWindowMs: number) {
    this.limit = limit;
    this.timeWindowMs = timeWindowMs;
  }

  limit: number;
  timeWindowMs: number;
}
