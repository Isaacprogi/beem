
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  resetUrl: string
  userEmail: string
}

export const PasswordResetEmail = ({
  resetUrl,
  userEmail,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>BleemHire Password Reset</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Your BleemHire Password</Heading>
        <Text style={text}>
          We received a request to reset the password for your BleemHire account ({userEmail}).
        </Text>
        <Text style={text}>
          Click the button below to create a new password:
        </Text>
        <Section style={buttonContainer}>
          <Link
            href={resetUrl}
            target="_blank"
            style={button}
          >
            Reset Your Password
          </Link>
        </Section>
        <Text style={text}>
          If the button above doesn't work, copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>{resetUrl}</Text>
        <Text style={text}>
          This password reset link will expire in 24 hours for security reasons.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
        </Text>
        <Text style={footer}>
          Questions? Contact us at support@bleemhire.com
        </Text>
        <Text style={footer}>
          Best regards,<br />
          The BleemHire Team
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 20px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.4',
  margin: '0 0 16px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const linkText = {
  color: '#2563eb',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const footer = {
  color: '#666',
  fontSize: '14px',
  margin: '8px 0',
}
