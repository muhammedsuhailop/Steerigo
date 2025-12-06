export interface GoogleLoginInput {
  code?: string;
  state?: string;
}

export class GoogleLoginDto {
  public readonly code: string;
  public readonly state?: string;

  constructor(data: unknown) {
    const input = (data ?? {}) as GoogleLoginInput;

    if (!input.code || typeof input.code !== "string") {
      throw new Error("Google login code is required");
    }

    this.code = input.code;
    this.state = typeof input.state === "string" ? input.state : undefined;
  }
}
