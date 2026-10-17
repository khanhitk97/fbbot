const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const randomDelay = (min = 2000, max = 5000) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function startBot() {
  console.log("=== KHỞI ĐỘNG BOT FACEBOOK ===");

  // Đường dẫn Chrome mặc định trên Windows
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: false,
      args: ['--disable-notifications', '--start-maximized']
    });
  } catch (e) {
    console.error("Không tìm thấy Chrome tại C:\\Program Files\\Google\\Chrome! Hãy chắc chắn máy đã cài Chrome.");
    return;
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Đọc file cookies.json nằm cùng thư mục file .exe
  const cookiePath = path.join(process.cwd(), 'cookies.json');
  if (fs.existsSync(cookiePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
    await page.setCookie(...cookies);
    console.log("-> Đã nạp cookies thành công.");
  } else {
    console.log("-> KHÔNG tìm thấy cookies.json cùng thư mục với file exe! Bot sẽ mở trang đăng nhập bình thường.");
  }

  // Đi đến bài viết (có thể đổi link bài viết tùy ý)
  console.log("-> Đang vào Facebook...");
  await page.goto('https://www.facebook.com', { waitUntil: 'networkidle2' });
  await randomDelay(3000, 5000);

  console.log("Bot đã sẵn sàng hoạt động!");
}

startBot();
