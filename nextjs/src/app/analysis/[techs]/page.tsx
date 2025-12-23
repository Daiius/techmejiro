import { getTechs } from "@/lib/techs";
import { redirect } from "next/navigation";

export default async function AnalysisPage({ params }: {
  params: Promise<{ techs: string }>
}) {
  const { techs } = await params;
  const decodedTechs = decodeURIComponent(techs);
  const parsedTechs = decodedTechs.split('+');

  // 技術一覧を取得
  const techsResult = await getTechs();
  if (!techsResult.success) {
    return <div><p>技術一覧データの取得に失敗しました</p></div>;
  }

  // 有効なtech.keyのSetを作成
  const validTechKeys = new Set(techsResult.data.map(tech => tech.key));

  // 正規化：有効なtech.keyのみをフィルタリング、重複削除 & 辞書順ソート
  const normalizedTechs = Array.from(new Set(parsedTechs))
    .filter(key => validTechKeys.has(key))
    .sort();
  const normalizedPath = normalizedTechs.join('+');

  // 元のパスと正規化されたパスを比較し、一致しない場合はリダイレクト
  if (decodedTechs !== normalizedPath) {
    redirect(`/analysis/${encodeURIComponent(normalizedPath)}`);
  }

  // 指定されたtech.keyに対応するtechsをフィルタリング
  const selectedTechs = techsResult.data.filter(tech =>
    normalizedTechs.includes(tech.key)
  );

  return (
    <article>
      <h2>{selectedTechs.map(tech => tech.name).join(", ")}</h2>
    </article>
  );
}
