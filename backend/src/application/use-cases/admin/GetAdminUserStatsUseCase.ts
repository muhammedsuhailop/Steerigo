import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetUserStatsRequestDto } from "@application/dto/admin/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "@application/dto/admin/GetUserStatsResponseDto";

@injectable()
export class GetAdminUserStatsUseCase
  implements
    IUseCase<GetUserStatsRequestDto, Promise<Result<GetUserStatsResponseDto>>>
{
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    dto: GetUserStatsRequestDto,
  ): Promise<Result<GetUserStatsResponseDto>> {
    try {
      const now = new Date();

      let fromDate = dto.getFromDate();
      let toDate = dto.getToDate();

      if (!fromDate || !toDate) {
        toDate = now;
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 7);  //default 7 days
      }

      const totalUsers = await this.userRepository.count();

      const newUsers = await this.userRepository.countByUserStats({
        createdAt: {
          from: fromDate,
          to: toDate,
        },
      });

      return Result.success({
        totalUsers,
        newUsers,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
