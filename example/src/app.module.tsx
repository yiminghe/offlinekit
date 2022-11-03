import { Module } from "nest-web/common";
import { AppService } from "./app.service";
import { RenderService } from "./render.service";

@Module({
  providers: [AppService, RenderService],
})
export class AppModule {}
