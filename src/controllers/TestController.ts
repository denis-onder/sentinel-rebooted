import { Request, Response } from "express";

class TestController {
  public test(req: Request, res: Response) {
    res
      .status(200)
      .json(`Test Completed. Status: 200, Timestamp: ${Date.now()}`);
  }
}

export default new TestController();
