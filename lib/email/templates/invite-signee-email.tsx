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
import {
  mainStyle,
  containerStyle,
  contentStyle,
  headerContainerStyle,
  headerLogoStyle,
  companyBadgeStyle,
  headingStyle,
  textStyle,
  documentHighlightBox,
  documentTitleStyle,
  buttonContainerStyle,
  buttonPrimaryStyle,
  tipBoxStyle,
  tipTextStyle,
  dividerStyle,
  subLinkTextStyle,
  linkStyle,
  footerContainerStyle,
  footerLegalStyle,
  spacerStyle,
} from '@/lib/email/styles';

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
          
          {/* Optional: Dark corporate header band */}
          <Section style={headerContainerStyle}>
            <Text style={headerLogoStyle}>{inviterName}</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={companyBadgeStyle}>Signature Request</Text>
            
            <Heading style={headingStyle}>Please Review & Sign</Heading>

            <Text style={textStyle}>{greeting}</Text>

            <Text style={textStyle}>
              You have been invited to review and electronically sign the following agreement:
            </Text>

            {/* Document Highlight Box — more breathing room */}
            <Section style={documentHighlightBox}>
              <Text style={documentTitleStyle}>📄 {contractTitle}</Text>
            </Section>

            {/* Primary Action Button */}
            <Section style={buttonContainerStyle}>
              <Button style={buttonPrimaryStyle} href={signUrl}>
                Review & Sign Document
              </Button>
            </Section>

            {/* Desktop Tip — cleaner, more subtle */}
            <Section style={tipBoxStyle}>
              <Text style={tipTextStyle}>
                💡 <strong>Tip:</strong> For the easiest reading experience with multi-page agreements, we recommend opening this link on a desktop computer.
              </Text>
            </Section>

            <Hr style={dividerStyle} />

            <Text style={subLinkTextStyle}>
              If the button above doesn't work, copy and paste this link into your browser:
              <br />
              <Link href={signUrl} style={linkStyle}>
                {signUrl}
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerContainerStyle}>
            <Text style={footerLegalStyle}>
              © {new Date().getFullYear()} {inviterName} Inc. All rights reserved.
              <br />
              This is a secure automated signature request sent via TrueSign.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InviteSigneeEmail;