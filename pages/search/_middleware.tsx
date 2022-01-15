import type { NextFetchEvent, NextRequest } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // const { access_token } = req.cookies;
  // if (!access_token)
  //   return Response.redirect(
  //     '/?errorCode=nocode&errorText=login with google required to perform any action',
  //   );
}
