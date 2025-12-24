import type { Result, AppError } from "@/types";
import type { ClientResponse } from "hono/client";

/**
 * Hono RPCのClientResponseをResult型に変換するヘルパー関数
 * ClientResponseの型パラメータから正しい型を推論します
 */
export async function fromHonoResponse<T>(
  response: ClientResponse<T>,
): Promise<Result<T, AppError>> {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        error: { type: "Unauthorized", message: "認証が必要です" },
      };
    }
    if (response.status === 404) {
      return {
        success: false,
        error: { type: "NotFound", message: "リソースが見つかりません" },
      };
    }
    return {
      success: false,
      error: {
        type: "NetworkError",
        message: `Request failed: ${response.statusText}`,
        status: response.status,
      },
    };
  }

  try {
    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: {
        type: "ParseError",
        message: "レスポンスの解析に失敗しました",
      },
    };
  }
}
