export default function handler(req: any, ev: any) {
  const q = new URL('https://something.com' + req.url).searchParams.get('q');
  if (!q) return Response.redirect('/');
}
