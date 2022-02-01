import jwt from 'jsonwebtoken';

export function middleware(req: any, ev: any) {
  const match = req.url.match(/\?q=([A-Za-z0-9\.\-_]+)/);
  let q: string | null;

  if (match) q = match[1];
  else q = null;

  if (!q) return new Response('Bad request', { status: 400 });

  try {
    console.log(q);
    jwt.verify(q as string, process.env.NEXT_PUBLIC_JWT_SECRET as string);
  } catch (err) {
    console.log(err);
    return new Response('Unauthorized', { status: 401 });
  }
}
