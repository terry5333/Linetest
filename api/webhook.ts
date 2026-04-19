import { VercelRequest, VercelResponse } from '@vercel/node';

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const MENU_MAIN = "richmenu-19209952";
const MENU_SOCIAL = "richmenu-19209959";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  const events = req.body.events;

  for (const event of events) {
    const userId = event.source.userId;

    // 🕵️ 偵測文字暗號：切換到社會選單
    if (event.type === 'message' && event.message.text === '我要看社會科') {
      await switchMenu(userId, MENU_SOCIAL);
    } 
    
    // 🕵️ 偵測文字暗號：回到主選單
    else if (event.type === 'message' && event.message.text === '回主選單') {
      await switchMenu(userId, MENU_MAIN);
    }
  }

  res.status(200).send('OK');
}

// 🚀 API 切換函式
async function switchMenu(userId: string, menuId: string) {
  await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu/${menuId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
    },
  });
}
