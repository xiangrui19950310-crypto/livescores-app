// src/api/fetcher.js
export async function getScores(category) {
  try {
    const res = await fetch(`http://localhost:9000/api/scores/${category}`);
    if (!res.ok) {
      throw new Error(`请求失败: ${res.status}`);
    }
    const data = await res.json();
    return data; // 后端返回 { matches: [...] }
  } catch (err) {
    console.error("获取比分失败:", err);
    return { matches: [] };
  }
}
