/**
 * Portfolio Importer Service
 * Parses GitHub repository or deployed portfolio website link
 * to create catalog service items under a selected category.
 */

export const parsePortfolioUrl = async (url) => {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('Укажите ссылку на репозиторий GitHub или сайт из портфолио.');
  }

  // Check if it's a GitHub URL
  const isGithub = cleanUrl.includes('github.com');
  
  let title = 'Сайт из портфолио';
  let description = 'Проект из репозитория портфолио.';
  let liveUrl = cleanUrl;
  let images = ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'];

  if (isGithub) {
    // Parse user, repo, path
    // e.g. https://github.com/vortexaiweb/portfolio/tree/main/1 -> user: vortexaiweb, repo: portfolio, path: 1
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/[^\/]+\/(.+))?/i);
    if (match) {
      const username = match[1];
      const repo = match[2];
      const subpath = match[3] || '';

      title = subpath ? `Сайт «${subpath}» (${repo})` : `Репозиторий «${repo}»`;
      description = `Проект из портфолио разработчика ${username}. Разработан на HTML/CSS/JS/React.`;
      
      if (subpath) {
        liveUrl = `https://${username}.github.io/${repo}/${subpath}`;
      } else {
        liveUrl = `https://${username}.github.io/${repo}`;
      }

      // Try fetching README from raw.githubusercontent.com
      try {
        const rawReadmeUrl = subpath
          ? `https://raw.githubusercontent.com/${username}/${repo}/main/${subpath}/README.md`
          : `https://raw.githubusercontent.com/${username}/${repo}/main/README.md`;
        
        const res = await fetch(rawReadmeUrl);
        if (res.ok) {
          const readmeText = await res.text();
          if (readmeText) {
            // First header as title
            const headerMatch = readmeText.match(/^#\s+(.+)$/m);
            if (headerMatch) title = headerMatch[1].trim();
            // Clean paragraph as description
            const cleanDesc = readmeText.replace(/#+.*/g, '').trim().slice(0, 300);
            if (cleanDesc) description = cleanDesc;
          }
        }
      } catch (err) {
        console.warn("Could not fetch raw README:", err);
      }
    }
  } else {
    // Standard Website URL
    try {
      const urlObj = new URL(cleanUrl);
      title = `Сайт ${urlObj.hostname}`;
      description = `Веб-сайт из портфолио (${cleanUrl})`;
    } catch {
      title = 'Проект из Портфолио';
    }
  }

  return {
    title,
    description,
    price: 500,
    currency: 'BYN',
    images,
    sourceUrl: cleanUrl,
    liveUrl,
    location: 'Онлайн / Беларусь',
    categoryId: ''
  };
};
