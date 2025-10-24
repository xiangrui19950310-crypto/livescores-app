// src/api/scores.js
export async function getScores(category) {
  try {
    // 从你的后端 API 获取实时比分
    const res = await fetch(`http://localhost:9000/api/scores/${category}`);
    const data = await res.json();

    // 返回比赛数据
    return data;
  } catch (error) {
    console.error("❌ 获取比分失败:", error);
    return { matches: [] };
  }
}
