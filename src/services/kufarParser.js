/**
 * Kufar Listing Importer Utility
 * Extracts product information (Title, Description, Price, Images, Category, Location)
 * from Kufar advertisement URLs (e.g. https://www.kufar.by/item/214983214)
 */

// Helper to extract item ID from Kufar URL
export const extractKufarItemId = (url) => {
  if (!url) return null;
  const match = url.match(/item\/(?:vi\/)?(\d+)/i) || url.match(/\/(\d{7,10})/);
  return match ? match[1] : null;
};

// CORS Proxies list for client-side HTML/API fetching on static sites
const PROXIES = [
  (targetUrl) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
  (targetUrl) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
  (targetUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
];

export const parseKufarUrl = async (url) => {
  const cleanUrl = url.trim();
  const itemId = extractKufarItemId(cleanUrl);

  if (!cleanUrl.includes('kufar.by')) {
    throw new Error('Укажите корректную ссылку на объявление Kufar (например: https://www.kufar.by/item/...)');
  }

  let htmlText = '';
  let apiJson = null;
  let fetchError = null;

  // 1. Try Kufar direct API if item ID found
  if (itemId) {
    const directApiUrl = `https://cre-api.kufar.by/items/v5/item/${itemId}/render?lang=ru`;
    for (const proxyGen of PROXIES) {
      try {
        const proxyUrl = proxyGen(directApiUrl);
        const res = await fetch(proxyUrl, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (data && (data.ad || data.subject)) {
            apiJson = data.ad || data;
            break;
          }
        }
      } catch (err) {
        fetchError = err;
      }
    }
  }

  // 2. If API parsing succeeded
  if (apiJson) {
    return formatKufarApiResult(apiJson, cleanUrl);
  }

  // 3. Fallback: Fetch raw HTML page via CORS proxy
  for (const proxyGen of PROXIES) {
    try {
      const proxyUrl = proxyGen(cleanUrl);
      const res = await fetch(proxyUrl);
      if (res.ok) {
        htmlText = await res.text();
        if (htmlText) break;
      }
    } catch (err) {
      fetchError = err;
    }
  }

  if (htmlText) {
    return parseKufarHtml(htmlText, cleanUrl, itemId);
  }

  // If fetching failed due to proxy restrictions, return basic template with URL pre-filled
  return {
    title: itemId ? `Объявление Kufar #${itemId}` : 'Новый товар с Куфара',
    description: 'Данные требуют подтверждения. Нажмите заполнить вручную если прокси заблокирован.',
    price: 0,
    currency: 'BYN',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'],
    location: 'Минск',
    sourceUrl: cleanUrl,
    categoryId: 'cat_electronics',
    needsManualCheck: true
  };
};

// Format API response payload
function formatKufarApiResult(ad, sourceUrl) {
  const title = ad.subject || ad.title || 'Товар с Kufar';
  const description = ad.body || ad.description || '';
  
  // Price extraction
  let price = 0;
  if (ad.price_byn) {
    price = parseFloat((parseInt(ad.price_byn) / 100).toFixed(2));
  } else if (ad.price) {
    price = parseFloat((parseInt(ad.price) / 100).toFixed(2));
  }

  // Images extraction
  let images = [];
  if (Array.isArray(ad.images)) {
    images = ad.images.map(img => {
      const path = typeof img === 'string' ? img : (img.path || img.filename);
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `https://img.kufar.by/v1/gallery/${path}`;
    }).filter(Boolean);
  }

  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'];
  }

  // Location extraction
  let location = 'Минск';
  if (ad.ad_parameters) {
    const locParam = ad.ad_parameters.find(p => p.p === 'region' || p.p === 'area');
    if (locParam && locParam.v) {
      location = Array.isArray(locParam.v) ? locParam.v.join(', ') : String(locParam.v);
    }
  }

  return {
    title,
    description,
    price,
    currency: 'BYN',
    images,
    location,
    sourceUrl,
    categoryId: 'cat_electronics'
  };
}

// Parse HTML page for __NEXT_DATA__ or OpenGraph tags
function parseKufarHtml(html, sourceUrl, itemId) {
  // Try __NEXT_DATA__ JSON script
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (nextDataMatch && nextDataMatch[1]) {
    try {
      const json = JSON.parse(nextDataMatch[1]);
      const ad = json?.props?.pageProps?.initialState?.ad || json?.props?.pageProps?.ad;
      if (ad) {
        return formatKufarApiResult(ad, sourceUrl);
      }
    } catch (e) {
      console.warn("Failed to parse __NEXT_DATA__", e);
    }
  }

  // Try OpenGraph Meta Tags
  const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
  const imageMatches = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/gi)];

  const title = titleMatch ? titleMatch[1].replace(' | Куфар', '').trim() : (itemId ? `Товар Kufar #${itemId}` : 'Товар Kufar');
  const description = descMatch ? descMatch[1].trim() : '';
  
  const images = imageMatches.map(m => m[1]).filter(url => url && !url.includes('kufar_og_logo'));

  // Price match from title or description (e.g. "250 р." or "1 500 руб")
  let price = 0;
  const priceMatch = (title + ' ' + description).match(/(\d[\d\s]*)\s*(?:руб|р\.|BYN)/i);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/\s+/g, ''), 10) || 0;
  }

  return {
    title,
    description,
    price,
    currency: 'BYN',
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'],
    location: 'Минск',
    sourceUrl,
    categoryId: 'cat_electronics'
  };
}
