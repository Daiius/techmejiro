import { Suspense } from "react";
import { getTechs } from "@/lib/techs";
import { redirect } from "next/navigation";
import type { Tech, Result, AppError } from "@/types";
import { getAnalysisBySingleTech } from "@/lib/analysis";
import { TechListItem } from "@/components/TechListItem";
import { TechLabel } from "@/components/TechLabel";
import { AutoWidthMejiroOshi } from "@/components/AutoWidthMejiroOshi";

const getTechsOrRedirect = async (
  techsParam: string,
): Promise<Result<Tech[], AppError>> => {
  const decodedTechs = decodeURIComponent(techsParam);
  const parsedTechs = decodedTechs.split("+");

  // 技術一覧を取得
  const techsResult = await getTechs();
  if (!techsResult.success) {
    return techsResult;
  }

  // 有効なtech.keyのSetを作成
  const validTechKeys = new Set(techsResult.data.map((tech) => tech.key));

  // 正規化：有効なtech.keyのみをフィルタリング、重複削除 & 辞書順ソート
  const normalizedTechs = Array.from(new Set(parsedTechs))
    .filter((key) => validTechKeys.has(key))
    .sort();
  const normalizedPath = normalizedTechs.join("+");

  // 元のパスと正規化されたパスを比較し、一致しない場合はリダイレクト
  if (decodedTechs !== normalizedPath) {
    redirect(`/analysis/${normalizedPath}`);
  }

  // 指定されたtech.keyに対応するtechsをフィルタリング
  const selectedTechs = techsResult.data.filter((tech) =>
    normalizedTechs.includes(tech.key),
  );

  return {
    success: true,
    data: selectedTechs,
  };
};

const AnalysisPageContent = async ({
  params,
}: {
  params: Promise<{ techs: string }>;
}) => {
  const { techs } = await params;
  const selectedTechs = await getTechsOrRedirect(techs);

  if (!selectedTechs.success) {
    return (
      <div>
        <p>技術一覧データの取得に失敗しました</p>
      </div>
    );
  }

  const tech = selectedTechs.data[0];
  const analysis = await getAnalysisBySingleTech(tech.key);
  if (!analysis.success) {
    return (
      <div>
        <p>分析データの取得に失敗しました</p>
      </div>
    );
  }

  const allTechs = await getTechs();
  if (!allTechs.success) {
    return (
      <div>
        <p>技術マスタの取得に失敗しました</p>
      </div>
    );
  }

  const maxUserCount = Math.max(...analysis.data.map((a) => a.userCount));

  return (
    <div className="flex flex-col">
      <h2 className="text-6xl self-center">
        <span>{selectedTechs.data.map((tech) => tech.name).join(" & ")}</span>
        <span> & ...</span>
      </h2>
      <ul className="list">
        {analysis.data.map((data) => (
          <TechListItem
            key={data.techKey}
            techName={data.techName}
            techUrl={
              allTechs.data.find((t) => t.key === data.techKey)?.url ?? ""
            }
          >
            <div className="flex gap-2">
              {allTechs.data
                .find((t) => t.key === data.techKey)
                ?.tags.map((t) => (
                  <TechLabel key={t.key} label={t.name} />
                ))}
            </div>
            <AutoWidthMejiroOshi
              className="list-col-grow"
              // なぜか 100% にすると幅の計算がおかしくなる...
              widthStyle={`${(data.userCount / maxUserCount) * 99.9}%`}
            />
            <span className="text-2xl">{data.userCount}</span>
          </TechListItem>
        ))}
      </ul>
    </div>
  );
};

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ techs: string }>;
}) {
  return (
    <article>
      <Suspense>
        <AnalysisPageContent params={params} />
      </Suspense>
    </article>
  );
}
