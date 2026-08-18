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
  inviterName = 'True Sports & Entertainment',
}: InviteSigneeEmailProps) {
  const greeting = signerName ? `Hello ${signerName},` : 'Hello,';

  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Main Content Body */}
          <Section style={contentStyle}>
            <Text style={companyBadgeStyle}>{inviterName.toUpperCase()}</Text>
            
            <Heading style={headingStyle}>Signature Request</Heading>

            <Text style={textStyle}>{greeting}</Text>

            <Text style={textStyle}>
              You have been invited to review and electronically sign the following agreement:
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

            {/* Desktop Tip */}
            <Section style={tipBoxStyle}>
              <Text style={tipTextStyle}>
                💡 <strong>Tip:</strong> For the easiest reading experience with multi-page agreements, we recommend opening this link on a desktop computer.
              </Text>
            </Section>

            <Hr style={dividerStyle} />

            <Text style={subLinkTextStyle}>
              If the button does not work, copy and paste this link into your browser:
              <br />
              <Link href={signUrl} style={linkStyle}>
                {signUrl}
              </Link>
            </Text>
          </Section>

          {/* Simple Clean Footer */}
          <Section style={footerContainerStyle}>
            <Text style={footerLegalStyle}>
              © {new Date().getFullYear()} True Sports &amp; Entertainment Inc. All rights reserved.
              <br />
              This is a secure automated signature request.
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
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 12px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  maxWidth: '520px',
  overflow: 'hidden',
};

const contentStyle: React.CSSProperties = {
  padding: '32px 32px 24px 32px',
};

const companyBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  color: '#64748b',
  margin: '0 0 8px 0',
};

const headingStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#0f172a',
  marginTop: '0',
  marginBottom: '16px',
  letterSpacing: '-0.4px',
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
  padding: '14px 16px',
  margin: '20px 0',
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
  backgroundColor: '#0f172a',
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
  padding: '20px 32px',
  textAlign: 'center',
};

const footerLegalStyle: React.CSSProperties = {
  fontSize: '11px',
  lineHeight: '16px',
  color: '#94a3b8',
  margin: 0,
};