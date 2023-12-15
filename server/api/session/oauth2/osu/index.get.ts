export default defineEventHandler(async (event) => {
  const [url, state] = await osuAuth.getAuthorizationUrl()
  setCookie(event, `osu_oauth_state`, state ?? '', {
    httpOnly: true,
    secure: !process.dev,
    path: '/',
    maxAge: 60 * 60,
  })
  return sendRedirect(event, url.toString())
})
