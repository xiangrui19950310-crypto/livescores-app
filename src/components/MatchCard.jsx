export default function MatchCard({ match }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow flex justify-between items-center hover:shadow-md transition">
      <div>
        <div className="font-semibold text-lg">
          {match.homeTeam} <span className="text-gray-400">vs</span> {match.awayTeam}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(match.startTime).toLocaleString()} · 状态：{match.status}
        </div>
      </div>
      <div className="text-2xl font-bold text-primary">
        {match.homeScore} - {match.awayScore}
      </div>
    </div>
  );
}
