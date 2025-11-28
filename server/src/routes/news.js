import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

// Scrape football news from multiple sources
async function scrapeFootballNews() {
    try {
        const news = [];

        // Scrape from BBC Sport Football
        try {
            const bbcResponse = await axios.get('https://www.bbc.com/sport/football', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 5000
            });

            const $ = cheerio.load(bbcResponse.data);

            // Extract news from BBC Sport
            $('.ssrcss-1mrs5ns-Stack').each((i, element) => {
                if (i < 5) { // Limit to 5 news items
                    const title = $(element).find('h2, h3').first().text().trim();
                    const link = $(element).find('a').first().attr('href');
                    const time = $(element).find('time').attr('datetime') || 'Recently';

                    if (title && title.length > 10) {
                        news.push({
                            title,
                            source: 'BBC Sport',
                            tag: determineTag(title),
                            time: formatTime(time),
                            link: link?.startsWith('http') ? link : `https://www.bbc.com${link}`
                        });
                    }
                }
            });
        } catch (error) {
            console.error('BBC scraping error:', error.message);
        }

        // Scrape from Sky Sports
        try {
            const skyResponse = await axios.get('https://www.skysports.com/football/news', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 5000
            });

            const $$ = cheerio.load(skyResponse.data);

            $$('.news-list__item').each((i, element) => {
                if (i < 5) {
                    const title = $$(element).find('.news-list__headline').text().trim();
                    const link = $$(element).find('a').first().attr('href');
                    const time = $$(element).find('.label__timestamp').text().trim() || 'Recently';

                    if (title && title.length > 10) {
                        news.push({
                            title,
                            source: 'Sky Sports',
                            tag: determineTag(title),
                            time: time,
                            link: link?.startsWith('http') ? link : `https://www.skysports.com${link}`
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Sky Sports scraping error:', error.message);
        }

        // If scraping fails, return fallback news
        if (news.length === 0) {
            return getFallbackNews();
        }

        // Sort by recency and return top 8
        return news.slice(0, 8);

    } catch (error) {
        console.error('Error scraping football news:', error);
        return getFallbackNews();
    }
}

// Determine news tag based on title content
function determineTag(title) {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('transfer') || titleLower.includes('sign') || titleLower.includes('deal')) {
        return 'TRANSFER';
    } else if (titleLower.includes('injury') || titleLower.includes('injured') || titleLower.includes('out')) {
        return 'INJURY';
    } else if (titleLower.includes('champions league') || titleLower.includes('ucl')) {
        return 'UCL';
    } else if (titleLower.includes('premier league') || titleLower.includes('epl')) {
        return 'EPL';
    } else if (titleLower.includes('breaking') || titleLower.includes('just in')) {
        return 'BREAKING';
    } else if (titleLower.includes('match') || titleLower.includes('win') || titleLower.includes('lose') || titleLower.includes('draw')) {
        return 'MATCH';
    } else if (titleLower.includes('manager') || titleLower.includes('coach')) {
        return 'MANAGER';
    } else {
        return 'NEWS';
    }
}

// Format time string
function formatTime(timeString) {
    try {
        if (timeString === 'Recently' || !timeString) {
            return 'Recently';
        }

        const date = new Date(timeString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    } catch (error) {
        return 'Recently';
    }
}

// Fallback news when scraping fails
function getFallbackNews() {
    return [
        {
            title: 'Premier League title race heats up as top teams clash',
            source: 'Football News',
            tag: 'EPL',
            time: '1h ago',
            link: '#'
        },
        {
            title: 'Star striker breaks scoring record in dramatic fashion',
            source: 'Football News',
            tag: 'BREAKING',
            time: '2h ago',
            link: '#'
        },
        {
            title: 'Major transfer deal confirmed by European giants',
            source: 'Football News',
            tag: 'TRANSFER',
            time: '3h ago',
            link: '#'
        },
        {
            title: 'Champions League knockout stages draw announced',
            source: 'Football News',
            tag: 'UCL',
            time: '4h ago',
            link: '#'
        },
        {
            title: 'Key midfielder ruled out for crucial upcoming fixtures',
            source: 'Football News',
            tag: 'INJURY',
            time: '5h ago',
            link: '#'
        },
        {
            title: 'Legendary manager announces retirement plans',
            source: 'Football News',
            tag: 'MANAGER',
            time: '6h ago',
            link: '#'
        },
        {
            title: 'Underdog team secures stunning victory against favorites',
            source: 'Football News',
            tag: 'MATCH',
            time: '7h ago',
            link: '#'
        },
        {
            title: 'International tournament qualifiers produce shocking results',
            source: 'Football News',
            tag: 'NEWS',
            time: '8h ago',
            link: '#'
        }
    ];
}

// GET /api/news - Fetch latest football news
router.get('/', async (req, res) => {
    try {
        const news = await scrapeFootballNews();

        res.json({
            success: true,
            data: news,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news',
            data: getFallbackNews()
        });
    }
});

// GET /api/news/:id - Fetch individual news article
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const news = await scrapeFootballNews();

        const articleIndex = parseInt(id);

        if (isNaN(articleIndex) || articleIndex < 0 || articleIndex >= news.length) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }

        const article = news[articleIndex];

        // Enhance article with generated content
        const enhancedArticle = {
            ...article,
            author: article.source === 'BBC Sport' ? 'BBC Sport Editorial Team' :
                article.source === 'Sky Sports' ? 'Sky Sports News' :
                    'Football News Team',
            summary: generateSummary(article.title, article.tag),
            content: generateContent(article.title, article.tag)
        };

        res.json({
            success: true,
            data: enhancedArticle
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch article'
        });
    }
});

// Generate article summary based on title and tag
function generateSummary(title, tag) {
    const summaries = {
        'BREAKING': `Breaking news in the world of football: ${title}. This developing story has caught the attention of fans and analysts worldwide.`,
        'TRANSFER': `Transfer news: ${title}. The football transfer market continues to heat up with this latest development.`,
        'UCL': `Champions League update: ${title}. European football's premier competition brings another exciting development.`,
        'EPL': `Premier League news: ${title}. The English top flight continues to deliver compelling storylines.`,
        'INJURY': `Injury report: ${title}. Team management and fans await further updates on this situation.`,
        'MANAGER': `Management news: ${title}. Coaching decisions continue to shape the landscape of football.`,
        'MATCH': `Match report: ${title}. Another thrilling encounter in the beautiful game.`,
        'NEWS': `Football news: ${title}. Stay updated with the latest from the world of football.`
    };

    return summaries[tag] || `${title}. Follow this story for more updates.`;
}

// Generate article content based on title and tag
function generateContent(title, tag) {
    const intro = generateSummary(title, tag);

    const contentTemplates = {
        'BREAKING': `${intro}\n\nThis breaking news story is developing rapidly, with sources close to the situation providing ongoing updates. The football community has reacted with significant interest to these developments.\n\nExperts and analysts are closely monitoring the situation, with many suggesting this could have far-reaching implications for the teams and players involved.\n\nFans have taken to social media to share their reactions, with the story trending across multiple platforms. The coming days are expected to bring further clarity to the situation.\n\nStay tuned for more updates as this story continues to develop.`,

        'TRANSFER': `${intro}\n\nTransfer negotiations have reportedly reached an advanced stage, with club officials working to finalize the details of the deal. Sources suggest that personal terms are being discussed alongside the transfer fee.\n\nThe player's current club has acknowledged the interest but maintains that no final decision has been made. Meanwhile, the potential destination club is said to be confident about completing the transfer.\n\nFootball analysts believe this move could significantly impact both clubs' strategies for the upcoming season. The transfer window remains open, and more developments are expected soon.\n\nFans of both clubs are eagerly awaiting official confirmation of the deal.`,

        'UCL': `${intro}\n\nThe Champions League continues to captivate football fans around the world with its high-stakes competition and world-class performances. This latest development adds another layer of intrigue to Europe's premier club competition.\n\nTeams are preparing intensively for their upcoming fixtures, with managers carefully strategizing to gain any possible advantage. The quality of football on display has been exceptional throughout the tournament.\n\nExperts predict that this news could influence the dynamics of upcoming matches, potentially affecting team selections and tactical approaches.\n\nThe road to the final promises more excitement and drama as the competition progresses.`,

        'EPL': `${intro}\n\nThe Premier League's reputation as the most competitive football league in the world continues to be reinforced by such developments. Teams are locked in intense battles across multiple fronts, from the title race to European qualification.\n\nManagers and players are under constant scrutiny as they navigate the demanding schedule and high expectations. Every match carries significant implications for league standings and season objectives.\n\nFans have been treated to exceptional football throughout the campaign, with this latest news adding to the narrative of an unforgettable season.\n\nThe coming weeks will be crucial in determining how this situation unfolds and impacts the final league standings.`,

        'INJURY': `${intro}\n\nMedical staff are conducting thorough assessments to determine the full extent of the injury and the expected recovery timeline. The club has stated that they will provide updates as more information becomes available.\n\nThis setback comes at a crucial time in the season, potentially affecting team selection and tactical plans for upcoming fixtures. The coaching staff will need to adapt their strategies accordingly.\n\nTeammates and fans have expressed their support, with many taking to social media to wish for a speedy recovery. The player's absence will undoubtedly be felt, given their importance to the team.\n\nThe club's medical team is working closely with the player to ensure the best possible rehabilitation process.`,

        'MANAGER': `${intro}\n\nManagerial decisions often prove pivotal in shaping a club's direction and success. This latest development has sparked widespread discussion among fans, pundits, and former players.\n\nThe individual in question brings a wealth of experience and a proven track record in football management. Their approach to tactics, player development, and team building will be closely scrutinized.\n\nClub officials have expressed confidence in this decision, citing alignment with the club's long-term vision and objectives. The appointment is expected to usher in a new era for the organization.\n\nFans are eager to see how this change will impact team performance and the club's competitive standing.`,

        'MATCH': `${intro}\n\nThe match delivered everything fans could hope for, with both teams displaying skill, determination, and tactical acumen. Key moments throughout the game kept spectators on the edge of their seats.\n\nIndividual performances stood out, with several players making significant contributions to their team's efforts. The tactical battle between the managers added an extra dimension to the contest.\n\nPost-match analysis has highlighted the critical decisions and turning points that shaped the final result. Both sets of fans witnessed a memorable encounter that will be discussed for some time.\n\nThe result has implications for league standings and team morale as the season progresses.`,

        'NEWS': `${intro}\n\nThis development in the football world has generated considerable interest across the sporting community. Various stakeholders are assessing the potential impact and implications of this news.\n\nIndustry experts have weighed in with their perspectives, offering analysis on what this means for the broader football landscape. The situation continues to evolve, with new information emerging regularly.\n\nFans and observers are following the story closely, engaging in discussions about its significance and potential outcomes. Social media platforms have seen active debate and commentary.\n\nFurther updates are expected as the situation develops and more details become available.`
    };

    return contentTemplates[tag] || contentTemplates['NEWS'];
}

export default router;
