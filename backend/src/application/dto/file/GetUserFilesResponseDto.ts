import { CloudinaryResourceDto } from "./CloudinaryResourceDto";

export class GetUserFilesResponseDto {
  readonly resources: CloudinaryResourceDto[];

  constructor(resources: CloudinaryResourceDto[]) {
    this.resources = resources;
  }
}
