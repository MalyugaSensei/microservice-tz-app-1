import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/user/constants';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
  ) { }
  async updateNoProblem() {
    const problemCounts = await this.userRepository.count({
      where: {
        problems: true
      }
    })

    if (problemCounts === 0) {
      return {
        problemCounts: 0
      }
    }
    const transaction = await this.userRepository.sequelize?.transaction()
    try {
      const batchSize = 10000;
      const numberOfWorkers = 5;

      const updateBatch = async (offset: number) => {
        while (true) {
          const users = await this.userRepository.findAll({
            where: { problems: true },
            limit: batchSize,
            offset: offset
          });

          if (users.length === 0) {
            break;
          }

          const userIds = users.map(user => user.id);

          await this.userRepository.update(
            { problems: false },
            { transaction, where: { id: userIds } }
          );

          offset += batchSize * numberOfWorkers;
        }
      };

      const workers = [];
      for (let i = 0; i < numberOfWorkers; i++) {
        workers.push(updateBatch(i * batchSize));
      }
      await Promise.all(workers);

    } catch (error) {
      return {
        error
      }
    }

    return {
      affectedRows: problemCounts
    }
  }
}
