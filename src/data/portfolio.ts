export type PortfolioItem = {
  title: string;
  type: string;
  label: string;
  image?: string;
  alt?: string;
  mockup?: string;
  crop?: { x: number; y: number; width: number; height: number; imageWidth: number };
};

// Each category preserves the order of the user-supplied images.
export const portfolio: PortfolioItem[] = [
  { title: 'FlowSpace', type: 'Website', label: '3D hero · Gradient mesh', image: './assets/portfolio/website-flowspace.png', alt: 'FlowSpace website with gradient mesh and colorful floating 3D elements' },
  { title: 'Fenewise', type: 'Website', label: 'IoT · Modern 3D hero', image: './assets/portfolio/website-iot.png', alt: 'Fenewise IoT website with a dark gradient and layered industrial machine imagery' },
  { title: 'Reshaped Kitchen', type: 'Website', label: 'Kitchen renovation · Website design', image: './assets/portfolio/website-kitchen.png', alt: 'Reshaped Kitchen renovation website with a warm contemporary kitchen hero' },
  { title: 'Snapx Services', type: 'Website', label: 'Handyman services · Website design', image: './assets/portfolio/website-snapx-services.png', alt: 'Snapx Services handyman website with a light background, lime-green navigation, floating hardware and a digital caliper' },
  { title: 'Cleanerr', type: 'Website', label: 'Cleaning agency · Website design', image: './assets/portfolio/website-cleaning.png', alt: 'Cleanerr cleaning agency website with a bright blue hero and cleaning professional' },
  { title: 'SunVault', type: 'Website', label: 'Energy company · Website design', image: './assets/portfolio/website-energy.png', alt: 'SunVault solar energy website featuring a modern solar-powered home' },
  { title: 'Sleak Branding', type: 'Branding', label: 'Chat platform · Brand identity', image: './assets/portfolio/branding-sleak.png', alt: 'Sleak chat brand identity with purple messaging icons and merchandise' },
  { title: 'Cultt Agrotech', type: 'Branding', label: 'Branding & strategy', image: './assets/portfolio/branding-cultt.png', alt: 'Cultt agricultural technology identity with pastel gradients, packaging and mobile designs' },
  { title: 'Airways Branding Concept', type: 'Branding', label: 'Airline · Brand concept', image: './assets/portfolio/branding-airways.png', alt: 'Yuingair airline branding concept with sunset gradients and travel applications' },
  { title: 'Brixzon Construction', type: 'Branding', label: 'Logo design · Brand identity', image: './assets/portfolio/branding-brixzon.png', alt: 'Brixzon Construction yellow and black logo system, stationery and workwear' },
  { title: 'Tennis Club Brand Identity', type: 'Branding', label: 'Sports branding · Visual system', image: './assets/portfolio/branding-tennis.png', alt: 'Smash tennis club identity with court photography and green and yellow graphic designs' },
  { title: 'Visionary', type: 'Branding', label: 'AI image generation · Brand identity', image: './assets/portfolio/branding-visionary.png', alt: 'Visionary AI image generation brand with warm orange gradients and a dark product interface' },
  { title: 'Pharmacy Mobile App', type: 'Apps', label: 'Pharmacy · Mobile app', image: './assets/portfolio/apps-pharmacy.png', alt: 'Xefag pharmacy mobile app with red, blue and yellow supplement product screens' },
  { title: 'MYGRID', type: 'Apps', label: 'Smart AI · Mobile app', image: './assets/portfolio/apps-mygrid.png', alt: 'MYGRID smart home battery app with dark energy dashboards and mint green controls' },
  { title: 'Mental Wellness Tracker', type: 'Apps', label: 'Mental wellness · Tracker app', image: './assets/portfolio/apps-wellness.png', alt: 'Mental wellness mobile app with activity tracking, psychologist appointments and mood summaries' },
  { title: 'Personal Finance iOS App', type: 'Apps', label: 'Personal finance · iOS app', image: './assets/portfolio/apps-finance.png', alt: 'Personal finance iOS app with lime green onboarding, wallet and spending analytics screens' },
  { title: 'Breakup Recovery App', type: 'Apps', label: 'Recovery · Mobile app design', image: './assets/portfolio/apps-recovery.png', alt: 'Breakup recovery mobile app with purple task lists, recovery plans and a gamified roadmap' },
  { title: 'GoodNotes', type: 'Apps', label: 'Collaborative notes · Mobile app', image: './assets/portfolio/apps-goodnotes.png', alt: 'GoodNotes collaborative mobile note-taking concept with yellow lecture notes and editing tools' },
  { title: 'Sport Marketplace', type: 'E-commerce', label: 'Sport marketplace · Web UI', image: './assets/portfolio/ecommerce-sport.png', alt: 'Sports marketplace web interface with purple accents, product filters and sporting goods' },
  { title: 'IRON THEORY', type: 'E-commerce', label: 'Fashion · E-commerce hero', image: './assets/portfolio/ecommerce-iron-theory.png', alt: 'IRON THEORY monochrome streetwear storefront with large typography and fashion photography' },
  { title: 'Protech', type: 'E-commerce', label: 'Electronics · E-commerce UI', image: './assets/portfolio/ecommerce-protech.png', alt: 'Protech dark electronics storefront with product filters and yellow accents' },
  { title: 'Shopcart', type: 'E-commerce', label: 'Electronics store · Web design', image: './assets/portfolio/ecommerce-shopcart.png', alt: 'Shopcart electronics storefront with a headphone promotion and product listings' },
  { title: 'Watch E-commerce', type: 'E-commerce', label: 'Watches · E-commerce website', image: './assets/portfolio/ecommerce-watch.png', alt: 'Sereno watch storefront featuring luxury watch photography and product collection grids' },
  { title: 'Clothing Website', type: 'E-commerce', label: 'Clothing · Landing page design', image: './assets/portfolio/ecommerce-clothing.png', alt: 'Milan clothing storefront with fashion photography, winter collections and category tiles' },
  { title: 'Meta Ads Overview', type: 'Meta Ads', label: 'Campaign reporting · Dashboard', image: './assets/portfolio/meta-overview.png', alt: 'Meta Ads dashboard with conversion, engagement, visibility and campaign reporting' },
  { title: 'Facebook Campaign Dashboard', type: 'Meta Ads', label: 'Campaign analytics · Dashboard', image: './assets/portfolio/meta-campaigns.png', alt: 'Facebook Ads dashboard with campaign metrics, frequency gauge and daily bar charts' },
  { title: 'Clicks & Campaign Insights', type: 'Meta Ads', label: 'Advertising insights · Dashboard', image: './assets/portfolio/meta-clicks.png', alt: 'Facebook Ads reporting dashboard with impressions, clicks, costs and frequency trends' },
  { title: 'Meta Ads Performance', type: 'Meta Ads', label: 'Performance reporting · Dashboard', image: './assets/portfolio/meta-performance.png', alt: 'Meta Ads performance dashboard with spend, revenue, clicks and purple metric charts' },
  { title: 'SEO Overview', type: 'SEO', label: 'Organic search · Dashboard', image: './assets/portfolio/seo-overview.png', alt: 'SEO dashboard with organic search traffic, sessions, page performance and conversion funnel' },
  { title: 'SEO Conversion Dashboard', type: 'SEO', label: 'Search analytics · Dashboard', image: './assets/portfolio/seo-conversions.png', alt: 'SEO dashboard with weekly metrics, clicks versus impressions, conversions and country breakdown' },
  { title: 'SEO Report', type: 'SEO', label: 'Search reporting · Dashboard', image: './assets/portfolio/seo-report.png', alt: 'SEO report with organic sessions, keyword ranks, search traffic and revenue summaries' },
  { title: 'Search Performance Comparison', type: 'SEO', label: 'Search performance · Reporting', image: './assets/portfolio/seo-search-performance.png', alt: 'Search performance comparison with blue clicks and purple impressions charts across two years' },
  { title: 'Traffic Trend', type: 'SEO', label: 'Organic visibility · Reporting', image: './assets/portfolio/seo-traffic.png', alt: 'Estimated traffic trend chart showing a blue area graph over several years' },
  { title: 'Search Results Performance', type: 'SEO', label: 'Search results · Reporting', image: './assets/portfolio/seo-search-results.png', alt: 'Search results performance dashboard with total clicks, impressions, average click-through rate, position and a three-month trend chart' },
  { title: 'AI Receptionist', type: 'AI Automation', label: 'AI Receptionist', image: './assets/portfolio/ai-receptionist-redesign.png', alt: 'AI receptionist with inbox and business knowledge screens' },
  { title: 'AI sales Rep', type: 'AI Automation', label: 'AI sales Rep', image: './assets/portfolio/ai-call-assistant.png', alt: 'AI sales representative with call forwarding, a dashboard and live call transcript' },
];
