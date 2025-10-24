// ===============================
// LiveScores 实时比分 后端服务
// ===============================

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ========== 基本配置 ==========
const PORT = process.env.PORT || 9000;
const API_SPORTS_KEY = process.env.API_SPORTS_KEY;

// ========== 工具函数：请求 API-SPORTS ==========
async function fetchFromApiSports(url, host) {
  try {
    const response = await fetch(url, {
      headers: {
        "x-apisports-key": API_SPORTS_KEY,
        "x-rapidapi-host": host,
      },
    });

    if (!response.ok) {
      console.error(`❌ 请求失败: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return (
      data.response?.map((item) => ({
        id: item.fixture?.id,
        league: item.league?.name || "未知联赛",
        homeTeam: item.teams?.home?.name,
        awayTeam: item.teams?.away?.name,
        homeScore: item.goals?.home ?? 0,
        awayScore: item.goals?.away ?? 0,
        status: item.fixture?.status?.short || "NS",
        startTime: item.fixture?.date,
      })) || []
    );
  } catch (error) {
    console.error("⚠️ 获取 API 数据出错:", error);
    return [];
  }
}

// ========== ⚽ 足球比分 ==========
app.get("/api/scores/football", async (req, res) => {
  try {
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset).toISOString().split("T")[0];

    const data = await fetchFromApiSports(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      "v3.football.api-sports.io"
    );

    res.json({ matches: data });
  } catch (error) {
    console.error("⚽ Football API Error:", error);
    res.status(500).json({ error: "获取足球比分失败" });
  }
});

// ========== 🏀 篮球比分（Mock） ==========
app.get("/api/scores/basketball", async (req, res) => {
  res.json({
    matches: [
      {
        id: 1,
        league: "NBA",
        homeTeam: "湖人",
        awayTeam: "勇士",
        homeScore: 108,
        awayScore: 105,
        status: "4Q",
        startTime: new Date().toISOString(),
      },
      {
        id: 2,
        league: "CBA",
        homeTeam: "广东",
        awayTeam: "辽宁",
        homeScore: 95,
        awayScore: 92,
        status: "FT",
        startTime: new Date().toISOString(),
      },
    ],
  });
});

// ========== 🎮 电竞比分（Mock） ==========
app.get("/api/scores/esports", async (req, res) => {
  res.json({
    matches: [
      {
        id: 101,
        league: "英雄联盟 LCK",
        homeTeam: "T1",
        awayTeam: "GEN.G",
        homeScore: 1,
        awayScore: 2,
        status: "FT",
        startTime: new Date().toISOString(),
      },
      {
        id: 102,
        league: "DOTA2 TI",
        homeTeam: "Team Spirit",
        awayTeam: "Gaimin Gladiators",
        homeScore: 2,
        awayScore: 0,
        status: "FT",
        startTime: new Date().toISOString(),
      },
    ],
  });
});

// ========== 🎾 网球比分（Mock） ==========
app.get("/api/scores/tennis", async (req, res) => {
  res.json({
    matches: [
      {
        id: 201,
        league: "ATP 上海大师赛",
        homeTeam: "德约科维奇",
        awayTeam: "纳达尔",
        homeScore: 2,
        awayScore: 1,
        status: "FT",
        startTime: new Date().toISOString(),
      },
      {
        id: 202,
        league: "WTA 武汉公开赛",
        homeTeam: "斯瓦泰克",
        awayTeam: "高芙",
        homeScore: 1,
        awayScore: 2,
        status: "FT",
        startTime: new Date().toISOString(),
      },
    ],
  });
});

// ========== ⚾ 棒球比分（Mock） ==========
app.get("/api/scores/baseball", async (req, res) => {
  res.json({
    matches: [
      {
        id: 301,
        league: "MLB",
        homeTeam: "道奇",
        awayTeam: "洋基",
        homeScore: 4,
        awayScore: 3,
        status: "9th",
        startTime: new Date().toISOString(),
      },
      {
        id: 302,
        league: "NPB 日本职业棒球",
        homeTeam: "巨人",
        awayTeam: "阪神虎",
        homeScore: 6,
        awayScore: 5,
        status: "FT",
        startTime: new Date().toISOString(),
      },
    ],
  });
});

// ========== 静态前端托管 ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  }
});

// ========== 启动服务 ==========
app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
