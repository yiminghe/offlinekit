import { Test } from "nest-web/testing";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";

describe("app", () => {
  it("should works", async () => {
    const app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const renderService = app.get<AppService>(AppService);
    expect(renderService.getVersion()).toBe("1");
  });

  it("mock works", async () => {
    const app = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue({
        getVersion: () => "2.x",
      })
      .compile();
    const renderService = app.get<AppService>(AppService);
    expect(renderService.getVersion()).toBe("2.x");
  });
});
