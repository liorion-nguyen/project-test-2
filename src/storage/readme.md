📌 1. getProgress() – Lấy tiến độ chơi
👉 Gọi trong màn hình chọn level (LevelsScreen.tsx)
📌 2. saveProgress() – Lưu tiến độ chơi
👉 Gọi khi người chơi hoàn thành một level (GameScreen.tsx)
📌 3. getAchievements() – Lấy danh sách thành tựu
👉 Gọi khi vào màn hình thành tựu (AchievementsScreen.tsx)
📌 4. saveAchievements() – Lưu thành tựu mới
👉 Được gọi bên trong checkAchievements()
📌 5. checkAchievements() – Kiểm tra thành tựu mới đạt được
👉 Được gọi bên trong saveProgress()
