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
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly web3: Web3;
  private whitelist: string[];
  private readonly contractAddress: string;
  private readonly privateKey: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {
    this.web3 = new Web3();
    this.privateKey = this.configService.get('pk');
    this.web3.eth.accounts.wallet.add(this.privateKey);
  }

  async onModuleInit() {
    try {
      this.whitelist = await axios
        .get('https://dweb.link/ipfs/' + this.configService.get('cid'))
        .then((res) =>
          (res.data as string).split(',').map((addr) => addr.toLowerCase()),
        );
    } catch (err) {
      this.logger.error(err.message, err.stack, AppService.name);
    }
  }

  async getWhitelist(): Promise<any | InternalServerErrorException> {
    return {
      signer: this.web3.eth.accounts.wallet[0].address,
      count: this.whitelist.length,
      list: this.whitelist.map(
        (addr) => addr.substr(0, 6) + '...' + addr.substring(38),
      ),
    };
  }

  async getSignature(
    payload: any,
  ): Promise<any | InternalServerErrorException | ForbiddenException> {
    try {
      const { address, contractAddress } = payload;

      if (!this.whitelist.includes(address.toLowerCase()))
        return new ForbiddenException();

      const message = this.web3.utils.sha3(
        this.web3.utils.toHex(contractAddress + address.substr(2)),
      );
      const { signature } = this.web3.eth.accounts.sign(
        message,
        this.privateKey,
      );
      return { signature, signer: this.web3.eth.accounts.wallet[0].address };
    } catch (err) {
      this.logger.error(err.message, err.stack, AppService.name);
      return new InternalServerErrorException();
    }
  }
}
