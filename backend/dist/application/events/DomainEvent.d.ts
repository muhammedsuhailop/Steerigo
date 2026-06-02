export interface DomainEvent<TType extends string = string, TPayload = unknown> {
    readonly type: TType;
    readonly occurredAt: Date;
    readonly payload: TPayload;
}
//# sourceMappingURL=DomainEvent.d.ts.map