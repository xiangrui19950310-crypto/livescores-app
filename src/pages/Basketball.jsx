import { useEffect, useState } from "react";
import { getScores } from "../api/fetcher";
import MatchCard from "../components/MatchCard";

export default function Basketball() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getScores("basketball");
    setMatches(data.matches);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🏀 篮球 即时比分</h2>
      {loading ? <div>加载中...</div> : (
        <div className="space-y-3">
          {matches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
}
