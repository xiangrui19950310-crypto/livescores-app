import React, { useEffect, useState } from "react";
import { getScores } from "../api/scores";

export default function Football() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getScores("football");
      setMatches(data.matches || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4">⚽ 足球 即时比分</h1>

      {loading ? (
        <p>加载中...</p>
      ) : matches.length === 0 ? (
        <p>暂无比赛</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="border rounded-xl p-4 bg-white shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg text-blue-700 mb-2">
                {match.league}
              </h2>
              <p className="text-gray-700">
                🏟 {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-xl font-bold mt-2">
                {match.homeScore} - {match.awayScore}
              </p>
              <p
                className={`mt-1 text-sm ${
                  match.status === "Match Finished"
                    ? "text-gray-500"
                    : match.status.includes("1H") || match.status.includes("2H")
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                状态：{match.status}
              </p>
              <p className="text-sm text-gray-400">
                开始时间：{new Date(match.startTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
