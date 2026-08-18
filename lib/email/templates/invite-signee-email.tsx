import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
  Img,
} from 'react-email';

export interface InviteSigneeEmailProps {
  signerName?: string | null;
  contractTitle: string;
  signUrl: string;
  inviterName?: string;
}

export function InviteSigneeEmail({
  signerName,
  contractTitle,
  signUrl,
  inviterName = 'The True Sports Team',
}: InviteSigneeEmailProps) {
  const greeting = signerName ? `Hello ${signerName},` : 'Hello,';

  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Solid True Black Header Bar */}
          <Section style={headerStyle}>
            <Img
              src="https://djap9svz4m9h0.cloudfront.net/ts-mini-logo.png"
              alt="True Sports Logo"
              width="80"
              style={logoStyle}
            />
          </Section>

          {/* Main Content Body */}
          <Section style={contentStyle}>
            <Heading style={headingStyle}>Signature Request</Heading>

            <Text style={textStyle}>{greeting}</Text>

            <Text style={textStyle}>
              <strong>{inviterName}</strong> has prepared and invited you to review and sign the following agreement:
            </Text>

            {/* Document Highlight Box */}
            <Section style={documentHighlightBox}>
              <Text style={documentTitleStyle}>📄 {contractTitle}</Text>
            </Section>

            {/* Primary Action Button */}
            <Section style={buttonContainerStyle}>
              <Button style={buttonStyle} href={signUrl}>
                Review &amp; Sign Document
              </Button>
            </Section>

            {/* Desktop Recommendation Tip */}
            <Section style={tipBoxStyle}>
              <Text style={tipTextStyle}>
                💻 <strong>Tip:</strong> For the best viewing experience with multi-page agreements, we recommend opening this link on a desktop or laptop computer.
              </Text>
            </Section>

            <Hr style={dividerStyle} />

            <Text style={subLinkTextStyle}>
              If the button above does not work, copy and paste this secure link into your browser:
              <br />
              <Link href={signUrl} style={linkStyle}>
                {signUrl}
              </Link>
            </Text>
          </Section>

          {/* Professional Footer */}
          <Section style={footerContainerStyle}>
            <Text style={footerLinksStyle}>
              <Link href="https://truesportslive.com" style={footerLinkItemStyle} target="_blank">
                truesportslive.com
              </Link>
              &nbsp;&nbsp;•&nbsp;&nbsp;
              <Link href="https://truemediastudios.com" style={footerLinkItemStyle} target="_blank">
                truemediastudios.com
              </Link>
            </Text>
            <Text style={footerLegalStyle}>
              © {new Date().getFullYear()} True Sports &amp; Entertainment Inc. All rights reserved.
              <br />
              This is a secure automated signature request. Please do not reply directly to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InviteSigneeEmail;

// --- Styles ---

const mainStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 12px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  maxWidth: '560px',
  overflow: 'hidden',
};

// Force pure solid black across all clients
const headerStyle: React.CSSProperties = {
  backgroundColor: '#000000',
  width: '100%',
  padding: '24px 0',
  textAlign: 'center',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const logoStyle: React.CSSProperties = {
  margin: '0 auto',
  display: 'block',
  height: 'auto',
};

const contentStyle: React.CSSProperties = {
  padding: '32px 32px 24px 32px',
};

const headingStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#0f172a',
  marginTop: '0',
  marginBottom: '16px',
  letterSpacing: '-0.3px',
};

const textStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#334155',
  margin: '12px 0',
};

const documentHighlightBox: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '12px 16px',
  margin: '18px 0',
};

const documentTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#0f172a',
  margin: 0,
};

const buttonContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0 16px 0',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
};

const tipBoxStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '10px 14px',
  margin: '16px 0 20px 0',
};

const tipTextStyle: React.CSSProperties = {
  fontSize: '12.5px',
  lineHeight: '18px',
  color: '#64748b',
  margin: '0',
  textAlign: 'center',
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid #e2e8f0',
  margin: '24px 0 16px 0',
};

const subLinkTextStyle: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#64748b',
};

const linkStyle: React.CSSProperties = {
  color: '#2563eb',
  wordBreak: 'break-all',
};

const footerContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
  padding: '24px 32px',
  textAlign: 'center',
};

const footerLinksStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  margin: '0 0 10px 0',
};

const footerLinkItemStyle: React.CSSProperties = {
  color: '#0f172a',
  fontWeight: '500',
  textDecoration: 'none',
};

const footerLegalStyle: React.CSSProperties = {
  fontSize: '11px',
  lineHeight: '16px',
  color: '#94a3b8',
  margin: 0,
};