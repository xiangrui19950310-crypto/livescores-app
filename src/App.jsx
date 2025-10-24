import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const statusColors = {
  FT: "bg-green-100 text-green-700",
  NS: "bg-gray-100 text-gray-600",
  LIVE: "bg-red-100 text-red-600 animate-pulse",
};

export default function App() {
  const [tab, setTab] = useState("football");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("light");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchScores = async (type = tab) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/scores/${type}`);
      const data = await res.json();
      setMatches(data.matches || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("获取比分出错:", error);
    } finally {
      setUpdating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const timer = setInterval(() => fetchScores(), 30000);
    return () => clearInterval(timer);
  }, [tab]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const filtered = matches.filter(
    (m) =>
      m.homeTeam?.toLowerCase().includes(search.toLowerCase()) ||
      m.awayTeam?.toLowerCase().includes(search.toLowerCase()) ||
      m.league?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-all ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* 顶部 */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col items-center py-4">
          <h1 className="text-3xl font-extrabold mb-3 flex items-center gap-2">
            <span className="text-yellow-500">⚡</span> LiveScores 实时比分
          </h1>

          {/* 分类切换 */}
          <Tabs>
            <TabsList>
              {[
                { key: "football", label: "⚽ 足球" },
                { key: "basketball", label: "🏀 篮球" },
                { key: "esports", label: "🎮 电竞" },
                { key: "tennis", label: "🎾 网球" },
                { key: "baseball", label: "⚾ 棒球" },
              ].map(({ key, label }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  activeTab={tab}
                  onClick={() => setTab(key)}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* 搜索 + 主题切换 */}
          <div className="flex items-center gap-3 mt-5">
            <Input
              placeholder="🔍 搜索球队或联赛..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
            >
              {theme === "light" ? "🌙 深色" : "☀️ 浅色"}
            </Button>
          </div>

          {/* 更新提示 */}
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {updating ? (
              <span className="animate-pulse">🔄 正在更新中...</span>
            ) : lastUpdate ? (
              <span>🕒 上次更新：{lastUpdate.toLocaleTimeString("zh-CN", { hour12: false })}</span>
            ) : (
              <span>正在加载数据...</span>
            )}
          </div>
        </div>
      </header>

      {/* 内容区 */}
      <main className="max-w-4xl mx-auto pt-44 px-4 pb-16">
        {loading ? (
          <p className="text-center mt-20 text-gray-500">⏳ 正在加载比赛数据...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center mt-20 text-gray-400">
            <img
              src="https://undraw.no/images/undraw_no_data_re_kwbl.svg"
              alt="empty"
              className="w-60 opacity-70 mb-4"
            />
            <p>暂无比赛数据</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div
                key={m.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`mb-4 border-0 shadow-md hover:shadow-lg transition-all ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-800 to-gray-700"
                      : "bg-white"
                  }`}
                >
                  <CardHeader>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {m.league}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold w-2/5">
                        <p>{m.homeTeam}</p>
                        <p className="mt-1">{m.awayTeam}</p>
                      </div>
                      <div className="text-center w-1/5">
                        <p className="text-2xl font-bold">
                          {m.homeScore} - {m.awayScore}
                        </p>
                        <p
                          className={`mt-1 text-xs inline-block px-2 py-1 rounded-full ${
                            statusColors[m.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {m.status}
                        </p>
                      </div>
                      <div className="text-right text-xs w-2/5 text-gray-500">
                        {new Date(m.startTime).toLocaleString("zh-CN", { hour12: false })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      <footer className="text-center py-6 text-gray-400 border-t border-gray-200 dark:border-gray-700 text-sm">
        © 2025 LiveScores 体育比分 · 实时更新
      </footer>
    </div>
  );
}
