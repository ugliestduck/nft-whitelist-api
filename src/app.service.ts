import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import Web3 from 'web3';

@Injectable()
export class AppService {
  private readonly web3: Web3;
  private readonly whitelist: string[];
  private readonly contractAddress: string;
  private readonly privateKey: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {
    this.web3 = new Web3();
    this.contractAddress = this.configService.get('contractAddress');
    this.privateKey = this.configService.get('pk');
    this.whitelist = this.configService
      .get('whitelist')
      .map((addr) => addr.toLowerCase());
  }

  async getSignature(
    payload: any,
  ): Promise<any | InternalServerErrorException | ForbiddenException> {
    try {
      const { address } = payload;
      if (this.whitelist.includes(address.toLowerCase()))
        return new ForbiddenException();

      const message = this.web3.utils.sha3(
        this.web3.utils.toHex(this.contractAddress + address.substr(2)),
      );
      const { signature } = this.web3.eth.accounts.sign(
        message,
        this.privateKey,
      );
      return { signature };
    } catch (err) {
      this.logger.error(err.message, err.stack, AppService.name);
      return new InternalServerErrorException();
    }

    return '';
  }
}