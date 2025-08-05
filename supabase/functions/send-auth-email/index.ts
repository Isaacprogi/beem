
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { SignupConfirmationEmail } from './_templates/signup-confirmation.tsx'
import { PasswordResetEmail } from './_templates/password-reset.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Received auth email request:', body)

    const { type, user, data } = body

    let html = ''
    let subject = ''
    let fromName = 'BleemHire'

    switch (type) {
      case 'signup':
        subject = 'Confirm Your BleemHire Sign Up'
        html = await renderAsync(
          React.createElement(SignupConfirmationEmail, {
            confirmationUrl: data.confirmationUrl,
            userEmail: user.email,
          })
        )
        break

      case 'recovery':
        subject = 'BleemHire Password Reset'
        html = await renderAsync(
          React.createElement(PasswordResetEmail, {
            resetUrl: data.resetUrl,
            userEmail: user.email,
          })
        )
        break

      case 'email_change':
        subject = 'Confirm Your BleemHire Email Change'
        // For now, we'll use a simple HTML template for email change
        html = `
          <h1>Confirm Your Email Change</h1>
          <p>Please confirm your new email address for your BleemHire account.</p>
          <a href="${data.confirmationUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Confirm Email Change</a>
        `
        break

      default:
        throw new Error(`Unsupported email type: ${type}`)
    }

    const { error } = await resend.emails.send({
      from: `${fromName} <noreply@resend.dev>`, // You can update this with your own domain later
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully to:', user.email)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in send-auth-email function:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to send email',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
