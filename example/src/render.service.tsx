import { AppService } from "./app.service";
import React from "react";
import ReactDOMClient from "react-dom/client";
import { Injectable } from "nest-web/common";

@Injectable()
export class RenderService {
  constructor(private readonly appService: AppService) {}
  render() {
    const root = ReactDOMClient.createRoot(document.getElementById("root"));

    root.render(
      <div>
        <div>版本：{this.appService.getVersion()}</div>
      </div>
    );
  }
}
