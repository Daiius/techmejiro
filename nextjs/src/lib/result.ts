import type { Result, Error } from "@/types";

/**
 * Hono RPCのResponseをResult型に変換するヘルパー関数
 */
export async function fromHonoResponse<T>(
  response: Response
): Promise<Result<T, Error>> {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        error: { type: "Unauthorized", message: "認証が必要です" }
      };
    }
    if (response.status === 404) {
      return {
        success: false,
        error: { type: "NotFound", message: "リソースが見つかりません" }
      };
    }
    return {
      success: false,
      error: {
        type: "NetworkError",
        message: `Request failed: ${response.statusText}`,
        status: response.status
      }
    };
  }

  try {
    const data = await response.json();
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: {
        type: "ParseError",
        message: "レスポンスの解析に失敗しました"
      }
    };
  }
}
