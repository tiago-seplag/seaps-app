export class ValidationError extends Error {
  action: string;
  statusCode: number;
  messages?: string[];

  constructor({
    message,
    action,
    messages,
    statusCode,
  }: {
    message: string;
    action: string;
    messages?: string[];
    statusCode?: number;
  }) {
    super(message || "Um erro de validação ocorreu.");
    this.name = "ValidationError";
    this.messages = messages;
    this.action = action || "Verifique se o serviço está disponível.";
    this.statusCode = statusCode || 400;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      messages: this.messages,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
