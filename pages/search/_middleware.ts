import type { NextFetchEvent, NextRequest } from 'next/server';

export default function handler(req: NextRequest, ev: NextFetchEvent) {
  const q = new URL('https://something.com' + req.url).searchParams.get('q');
  if (!q) return Response.redirect('/');
}
