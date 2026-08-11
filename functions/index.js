const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

/**
 * HTTP Callable function to parse a Kufar listing URL server-side
 * avoids CORS issues on client browser
 */
exports.parseKufarItem = functions.https.onCall(async (data, context) => {
  // Enforce admin auth if needed
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Ошибок нет: необходима авторизация!');
  }

  const { url } = data;
  if (!url || !url.includes('kufar.by')) {
    throw new functions.https.HttpsError('invalid-argument', 'Некорректная ссылка на Kufar.');
  }

  const itemIdMatch = url.match(/item\/(?:vi\/)?(\d+)/i) || url.match(/\/(\d{7,10})/);
  const itemId = itemIdMatch ? itemIdMatch[1] : null;

  try {
    if (itemId) {
      const apiUrl = `https://cre-api.kufar.by/items/v5/item/${itemId}/render?lang=ru`;
      const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const json = await res.json();
        const ad = json.ad || json;
        return {
          title: ad.subject || 'Товар Kufar',
          description: ad.body || '',
          price: ad.price_byn ? parseFloat((parseInt(ad.price_byn) / 100).toFixed(2)) : 0,
          currency: 'BYN',
          images: Array.isArray(ad.images) 
            ? ad.images.map(img => `https://img.kufar.by/v1/gallery/${typeof img === 'string' ? img : (img.path || img.filename)}`)
            : [],
          sourceUrl: url,
          location: 'Минск'
        };
      }
    }
  } catch (err) {
    console.error("Cloud function parse error:", err);
  }

  throw new functions.https.HttpsError('internal', 'Не удалось распарсить объявление Kufar.');
});
