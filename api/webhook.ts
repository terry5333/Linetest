import { VercelRequest, VercelResponse } from '@vercel/node';

// 從 Vercel 環境變數讀取 Token，如果沒設會報錯
const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// 填入你拿到的 Rich Menu ID
const MENU_MAIN = "richmenu-你的主選單ID";
const MENU_SOCIAL = "richmenu-你的社會選單ID";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只處理 POST 請求 (LINE 傳過來的)
  if (req.method !== 'POST') {
    return res.status(200).send('Webhook Server is Running!');
  }

  try {
    const events = req.body.events;
    console.log('收到 LINE 事件:', JSON.stringify(events));

    for (const event of events) {
      const userId = event.source.userId;

      // 🕵️ 偵測：文字暗號「我要看社會科」
      if (event.type === 'message' && event.message.type === 'text' && event.message.text === '我要看社會科') {
        console.log(`用戶 ${userId} 請求切換至社會選單`);
        await switchMenu(userId, MENU_SOCIAL);
      } 
      
      // 🕵️ 偵測：文字暗號「回主選單」
      else if (event.type === 'message' && event.message.type === 'text' && event.message.text === '回主選單') {
        console.log(`用戶 ${userId} 請求回到主選單`);
        await switchMenu(userId, MENU_MAIN);
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).send('Internal Server Error');
  }
}

// 🚀 API 呼叫：幫特定用戶綁定圖文選單
async function switchMenu(userId: string, menuId: string) {
  const url = `https://api.line.me/v2/bot/user/${userId}/richmenu/${menuId}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`切換選單失敗 (${menuId}):`, errorData);
  } else {
    console.log(`成功切換選單: ${menuId}`);
  }
}
