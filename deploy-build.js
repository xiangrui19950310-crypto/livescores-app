/**
 * 部署构建脚本 - 自动构建前端并准备 Express 部署目录
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 正在构建 LiveScores 前端...");

try {
  // 构建前端
  execSync("npm run build", { stdio: "inherit" });

  // 检查 dist 文件夹
  const distPath = path.resolve("./dist");
  if (!fs.existsSync(distPath)) {
    console.error("❌ 构建失败：未找到 dist 目录");
    process.exit(1);
  }

  console.log("✅ 前端构建完成，已生成 dist 文件夹。");
  console.log("📦 准备部署 Express 服务...");
} catch (err) {
  console.error("构建错误:", err);
  process.exit(1);
}
