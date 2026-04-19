import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  const events = req.body.events;
  if (!events || events.length === 0) return res.status(200).send('OK');

  const event = events[0];
  const userId = event.source.userId;

  // 1. 偵測文字暗號
  if (event.type === 'message' && event.message.type === 'text') {
    const text = event.message.text;

    // 切換至社會科選單
    if (text.includes('社會')) {
      await switchMenu(userId, process.env.MENU_SOCIAL!);
    } 
    // 切換回主選單
    else if (text.includes('主選單') || text.includes('返回')) {
      await switchMenu(userId, process.env.MENU_MAIN!);
    }
  }

  return res.status(200).send('OK');
}

async function switchMenu(userId: string, menuId: string) {
  const url = `https://api.line.me/v2/bot/user/${userId}/richmenu/${menuId}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
  });

  const result = await response.text();
  console.log(`切換狀態: ${response.status}, 結果: ${result}`);
}
