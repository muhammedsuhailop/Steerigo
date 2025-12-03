export class CloudinaryResourceDto {
  readonly public_id: string;
  readonly secure_url: string;
  readonly format: string;
  readonly bytes: number;
  readonly created_at: string;

  constructor(
    public_id: string,
    secure_url: string,
    format: string,
    bytes: number,
    created_at: string
  ) {
    this.public_id = public_id;
    this.secure_url = secure_url;
    this.format = format;
    this.bytes = bytes;
    this.created_at = created_at;
  }
}
