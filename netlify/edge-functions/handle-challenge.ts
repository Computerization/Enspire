async function handleTurnstile(request: Request) {
  const body = await request.formData()
  // Turnstile injects a token in "cf-turnstile-response".
  const token = body.get('cf-turnstile-response')
  const ip = request.headers.get('CF-Connecting-IP')

  // Validate the token by calling the
  // "/siteverify" API endpoint.
  const formData = new FormData()
  formData.append('secret', Netlify.env.get('TURNSTILE_SECRET'))
  if (token)
    formData.append('response', token)
  if (ip)
    formData.append('remoteip', ip)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  })

  const outcome = await result.json()
  return !!outcome.success
}

export default async (request: Request) => {
  const userAgent = request.headers.get('user-agent') || ''
  const turnstileWidget = '<body><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer="defer"></script><div class="cf-turnstile" data-sitekey="0x4AAAAAAAxDMjtUWpd9d64q" data-callback="javascriptCallback"></div><script></script></body>'

  if (!userAgent.length) {
    return new Response('Access Denied: User-Agent is required', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  if (!(await handleTurnstile(request))) {
    return new Response(turnstileWidget, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}

export const config = { path: '/*' }
