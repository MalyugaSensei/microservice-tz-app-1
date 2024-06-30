import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { USER_REPOSITORY } from 'src/user/constants';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserService {
  private readonly batchSize = 10000;
  private readonly numberOfWorkers = 5;
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

    if (!transaction) {
      return {
        error: 'Transaction error'
      }
    }

    try {
      const updateBatch = async (offset: number, transaction: Transaction) => {
        while (true) {
          const users = await this.userRepository.findAll({
            where: { problems: true },
            limit: this.batchSize,
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

          offset += this.batchSize * this.numberOfWorkers;
        }
      };

      const workers = [];
      for (let i = 0; i < this.numberOfWorkers; i++) {
        workers.push(updateBatch(i * this.batchSize, transaction));
      }
      await Promise.all(workers);
      await transaction?.commit()
    } catch (error) {
      console.log(error)
      await transaction?.rollback()
      return {
        error
      }
    }

    return {
      affectedRows: problemCounts
    }
  }
}
