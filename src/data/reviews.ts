// Transcribed only from the supplied screenshots. Ellipses preserve truncation.
export type Review = {
  name: string; date: string; quote: string; source: string;
  dimensions: [number, number]; card: [number, number]; avatar: [number, number, number];
};
const first = './assets/reviews/client-reviews-01.png';
const second = './assets/reviews/client-reviews-02.png';
export const reviews: Review[] = [
  { name: 'Tim Beanland', date: '2 months ago', quote: 'Camerons cold calls on Tik Tok and Instagram was 1 factor in lifting my poor mental health …', source: first, dimensions: [1374, 284], card: [0, 339], avatar: [18, 18, 48] },
  { name: 'Paul Warner', date: '2 months ago', quote: 'Would recommend the Third Fade team to any businesses looking to get their ads up leads to their business. The…', source: first, dimensions: [1374, 284], card: [359, 318], avatar: [381, 18, 50] },
  { name: 'Ben McQueen', date: '2 months ago', quote: 'Third Fade has been very helpful in bringing leads/jobs to our business. Ozkan has been very helpful', source: first, dimensions: [1374, 284], card: [696, 318], avatar: [719, 18, 50] },
  { name: 'Jaydon Slater', date: '2 months ago', quote: "Working with Ozkan from Third Fade has been one of the best business decisions we've made. In under 3 months, they've helped…", source: first, dimensions: [1374, 284], card: [1034, 340], avatar: [1055, 18, 50] },
  { name: 'Gavin Harris', date: '3 weeks ago', quote: 'The strategy Third Fade put together for us was spot on. Within 6 weeks we saw a massive jump in leads. Huge thank you to the team …', source: second, dimensions: [1364, 750], card: [0, 332], avatar: [32, 48, 72] },
  { name: 'Natalie Young', date: '1 month ago', quote: 'Would highly recommend Third Fade to anyone trying to scale their ads. They took over our campaigns and we saw immediate improvement. The…', source: second, dimensions: [1364, 750], card: [352, 323], avatar: [388, 48, 70] },
  { name: 'Marcus Brody', date: '2 months ago', quote: 'Absolutely brilliant service. The guys at Third Fade really understand how to generate high-quality inquiries. They make the whole process super…', source: second, dimensions: [1364, 750], card: [697, 323], avatar: [735, 48, 70] },
  { name: 'Olivia Chen', date: '2 months ago', quote: "Third Fade has completely transformed our digital marketing. Their attention to detail and consistent results have been outstanding. Can't recommend…", source: second, dimensions: [1364, 750], card: [1042, 322], avatar: [1080, 48, 72] },
];
