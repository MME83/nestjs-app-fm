import { ResponseSuccess } from './helper.dto';

export class Helper {
  public static resSuccess<T>(statusCode: number, data: T): ResponseSuccess<T> {
    return {
      status: 'success',
      statusCode: statusCode,
      data,
    };
  }

  // See: https://stackoverflow.com/a/44678459/5091346
  public static genId(length = 16): string {
    const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...Array(length)].reduce(
      (a) => a + p[~~(Math.random() * p.length)],
      '',
    );
  }
}
