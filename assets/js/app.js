async function getLiveLocation() {
    try {
        const geoResponse = await fetch('https://ipapi.co');
        const geoData = await geoResponse.json();
        if (geoData.city && geoData.country_name) {
            document.getElementById('system-localization').innerText = `📍 ${geoData.city}, ${geoData.country_name}`;
        } else {
            document.getElementById('system-localization').innerText = `📍 Dhaka, Bangladesh`;
        }
    } catch (e) {
        document.getElementById('system-localization').innerText = `📍 Mouchak, Bangladesh`;
    }
}

async function loadNews() {
    getLiveLocation();

    try {
        const response = await fetch('news.json');
        const dataPayload = await response.json();
        
        const newsData = dataPayload.news || [];
        const briefingData = dataPayload.briefing || [];
        
        if (!newsData || newsData.length === 0) {
            console.error("The dynamic database file array is unpopulated.");
            return;
        }

        // Render the AI Executive Summary Bullets
        if (briefingData && briefingData.length > 0) {
            const briefingTarget = document.getElementById('briefing-target');
            briefingTarget.innerHTML = ""; 
            briefingData.forEach(bullet => {
                const li = document.createElement('li');
                li.innerText = bullet;
                briefingTarget.appendChild(li);
            });
            document.getElementById('briefing-section').style.display = 'block';
        }

        // Load primary headline item into Hero slot
        const heroNews = newsData[0];
        document.getElementById('hero-img').src = heroNews.image;
        document.getElementById('hero-title').innerText = heroNews.title;
        document.getElementById('hero-summary').innerText = heroNews.summary;
        document.getElementById('hero-meta').innerText = `${heroNews.category.toUpperCase()} WIRE • RANK: ${heroNews.score}`;
        document.getElementById('hero-url').href = heroNews.url;
        document.getElementById('top-hero').style.display = 'grid';

        // Slow TV Wire Ticker Loop
        const tickerTarget = document.getElementById('ticker-text-target');
        tickerTarget.innerHTML = "";
        newsData.forEach(news => {
            const item = document.createElement('div');
            item.className = 'ticker-item';
            item.innerText = `⚡ ${news.title.toUpperCase()} [${news.region.toUpperCase()}]   •   `;
            tickerTarget.appendChild(item);
        });

        // DOM target nodes for categories
        const grids = {
            Politics: document.getElementById('politics-grid'),
            Business: document.getElementById('business-grid'),
            Sports: document.getElementById('sports-grid'),
            Entertainment: document.getElementById('entertainment-grid'),
            Tech: document.getElementById('tech-grid')
        };
        
        // Reset container contents completely before mapping items
        Object.values(grids).forEach(g => { if(g) g.innerHTML = ""; });

        // Populate Cards Dynamically with fixed capitalization matching
        newsData.forEach((news, idx) => {
            if (idx === 0) return; // Skip item pinned to top hero
            
            // Standardize string comparison to match case-insensitive names safely
            const targetCategory = news.category.trim();
            let colorClass = "card-politics";
            let badgeBg = "background: #e0f2fe; color: #0369a1;";
            
            if (targetCategory === "Business") {
                colorClass = "card-politics";
                badgeBg = "background: #fef3c7; color: #b45309;";
            } else if (targetCategory === "Sports") {
                colorClass = "card-sports";
                badgeBg = "background: #d1fae5; color: #047857;";
            } else if (targetCategory === "Entertainment") {
                colorClass = "card-entertainment";
                badgeBg = "background: #fce7f3; color: #be185d;";
            } else if (targetCategory === "Tech") {
                colorClass = "card-sports"; 
                badgeBg = "background: #f3e8ff; color: #6b21a8;";
            }

            const cardHTML = `
                <div class="magazine-card ${colorClass}">
                    <div>
                        <div class="card-meta-row">
                            <span class="badge-tag" style="${badgeBg}">${news.category} [${news.region}]</span>
                            <span style="font-size: 11px; font-weight: bold; color: #64748b;">SCORE: ${news.score}</span>
                        </div>
                        <h4 class="card-title"><a href="${news.url}" target="_blank">${news.title}</a></h4>
                        <p class="card-summary">${news.summary}</p>
                    </div>
                    <a href="${news.url}" target="_blank" class="read-dispatch-btn" style="color: #4f46e5; font-weight: 700; text-decoration: none; font-size: 12px; margin-top: 15px; display: inline-block;">Read Story →</a>
                </div>
            `;
            
            // Map strictly based on the clean key structure matching your components
            if (grids[targetCategory]) {
                grids[targetCategory].innerHTML += cardHTML;
            } else {
                grids.Politics.innerHTML += cardHTML;
            }
        });
    } catch (e) { console.error("Dynamic news mapping failure:", e); }
}

window.onload = loadNews;