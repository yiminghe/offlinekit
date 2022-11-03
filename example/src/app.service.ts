import { Injectable } from "nest-web/common";

@Injectable()
export class AppService {
  getVersion(): string {
    return process.env.REACT_APP_VERSION;
  }
}
