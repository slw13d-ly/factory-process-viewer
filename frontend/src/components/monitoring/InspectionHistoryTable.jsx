import './InspectionHistoryTable.css'

// 판정 결과를 색이 다른 pill(둥근 뱃지)로 보여주는 아주 작은 컴포넌트.
// 이 테이블에서만 쓰여서 별도 파일로 안 빼고 같이 둡니다.
function StatusPill({ status }) {
  const isDefect = status === '불량'
  return (
    <span className={`status-pill ${isDefect ? 'status-pill--defect' : 'status-pill--good'}`}>
      {status}
    </span>
  )
}

// records: useFactoryData가 이미 최신순으로 정렬해서 내려주는 배열이라
// 여기서는 다시 정렬하지 않고 받은 순서 그대로 렌더링합니다.
function InspectionHistoryTable({ records }) {
  return (
    <div className="history-table-wrap">
      <table className="history-table">
        <thead>
          <tr>
            <th>제품 ID</th>
            <th>시각</th>
            <th>판정</th>
            <th>사유</th>
            <th>단계</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            // key는 배열 인덱스가 아니라 record.id를 씁니다. 새 기록이 맨 앞에
            // 계속 추가되기 때문에, 인덱스를 key로 쓰면 React가 "몇 번째 자리"만
            // 보고 엉뚱한 행에 이전 값을 재사용해버려 화면이 깜빡이거나
            // 어긋날 수 있습니다.
            <tr key={record.id}>
              <td className="mono">{record.id}</td>
              <td className="mono">{record.time}</td>
              <td>
                <StatusPill status={record.status} />
              </td>
              <td className={record.reason ? '' : 'muted'}>{record.reason ?? '-'}</td>
              <td className="muted">{record.stage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InspectionHistoryTable
