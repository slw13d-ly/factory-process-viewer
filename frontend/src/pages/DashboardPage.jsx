import { useFactoryData } from "../hooks/useFactoryData";
import { usePosts } from "../hooks/usePosts";
import KpiCards from "../components/monitoring/KpiCards";
import DefectRateWarning from "../components/monitoring/DefectRateWarning";
import Mimic from "../components/monitoring/Mimic";
import InspectionHistoryTable from "../components/monitoring/InspectionHistoryTable";
import BoardPreviewPanel from "../components/board/BoardPreviewPanel";
import "../App.css";

// 불량률이 이 값을 넘으면 "위험" 상태로 취급합니다.
// KpiCards(카드 빨간색)와 DefectRateWarning(경고 배너)이 같은 조건을 같이 써야
// 하므로, 숫자 자체는 여기 한 곳에서만 관리하고 두 컴포넌트에는 계산된
// true/false만 내려줍니다. 기준을 바꾸고 싶으면 이 줄만 고치면 됩니다.
const DEFECT_RATE_WARNING_THRESHOLD = 8;

function DashboardPage() {
  // DashboardPage는 useFactoryData()를 호출하는 유일한 곳입니다.
  // 아래 컴포넌트들은 이 훅을 직접 부르지 않고, DashboardPage가 내려주는 값을
  // props로만 받습니다 — 그래서 이 데이터가 목업인지 실제 서버인지 전혀 모릅니다.
  // (line은 요구된 데이터 모양이라 가져오긴 하지만, 아직 화면에 쓰는 곳은
  // 없습니다 — 나중에 라인 상태 표시가 필요해지면 여기서 꺼내 쓰면 됩니다.)
  const { metrics, records } = useFactoryData();
  const { posts } = usePosts();
  const isDefectRateHigh = metrics.defectRate > DEFECT_RATE_WARNING_THRESHOLD;

  return (
    <div className="app">
      <h1>MES 생산 모니터링 대시보드</h1>

      <KpiCards metrics={metrics} isDefectRateHigh={isDefectRateHigh} />
      <DefectRateWarning
        isDefectRateHigh={isDefectRateHigh}
        defectRate={metrics.defectRate}
      />

      <div className="dashboard-row">
        <section className="panel dashboard-row__flow">
          <h2 className="panel__title">공정 흐름</h2>
          <Mimic records={records} />
        </section>
        <BoardPreviewPanel posts={posts} />
      </div>

      <section className="panel">
        <h2 className="panel__title">검사 이력 (최신순)</h2>
        <InspectionHistoryTable records={records} />
      </section>
    </div>
  );
}

export default DashboardPage;
