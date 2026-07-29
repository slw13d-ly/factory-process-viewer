import { useFactoryData } from '../hooks/useFactoryData'
import { usePosts } from '../hooks/usePosts'
import { useReports } from '../hooks/useReports'
import KpiCards from '../components/monitoring/KpiCards'
import DefectRateWarning from '../components/monitoring/DefectRateWarning'
import Mimic from '../components/monitoring/Mimic'
import InspectionHistoryTable from '../components/monitoring/InspectionHistoryTable'
import BoardPreviewPanel from '../components/board/BoardPreviewPanel'
import '../App.css'

// 불량률이 이 값을 넘으면 "위험" 상태로 취급합니다.
const DEFECT_RATE_WARNING_THRESHOLD = 8

function DashboardPage() {
  const { metrics, records } = useFactoryData()
  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
  } = usePosts({ size: 5 })
  const {
    reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useReports({ size: 5 })
  const isDefectRateHigh = metrics.defectRate > DEFECT_RATE_WARNING_THRESHOLD

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
        <BoardPreviewPanel
          board={{
            items: posts,
            isLoading: postsLoading,
            error: postsError,
          }}
          report={{
            items: reports,
            isLoading: reportsLoading,
            error: reportsError,
          }}
        />
      </div>

      <section className="panel">
        <h2 className="panel__title">검사 이력 (최신순)</h2>
        <InspectionHistoryTable records={records} />
      </section>
    </div>
  )
}

export default DashboardPage
