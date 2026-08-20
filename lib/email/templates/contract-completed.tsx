import * as React from "react";
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
} from "react-email";
import {
  mainStyle,
  containerStyle,
  contentStyle,
  headerContainerStyle,
  headerLogoStyle,
  companyBadgeStyle,
  headingStyle,
  textStyle,
  textMutedStyle,
  successBoxStyle,
  buttonContainerStyle,
  buttonPrimaryStyle,
  dividerStyle,
  subLinkTextStyle,
  linkStyle,
  footerContainerStyle,
  footerLegalStyle,
} from "@/lib/email/styles";

export interface ContractSignedCompletedEmailProps {
  recipientName: string;
  contractTitle: string;
  downloadUrl: string;
  companyName?: string;
}

export function ContractSignedCompletedEmail({
  recipientName,
  contractTitle,
  downloadUrl,
  companyName = "True Sports & Entertainment",
}: ContractSignedCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          
          {/* Corporate Header */}
          <Section style={headerContainerStyle}>
            <Text style={headerLogoStyle}>{companyName}</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={companyBadgeStyle}>Execution Complete</Text>
            
            <Heading style={headingStyle}>Contract Fully Executed</Heading>

            <Text style={textStyle}>Hello {recipientName},</Text>

            <Text style={textStyle}>
              Great news — all required parties have successfully signed the agreement below.
            </Text>

            {/* Success Status Box */}
            <Section style={successBoxStyle}>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#166534",
                  margin: "0 0 4px 0",
                }}
              >
                ✅ {contractTitle}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#15803d",
                  margin: 0,
                }}
              >
                All signatures collected · Executed · Ready for download
              </Text>
            </Section>

            <Text style={textMutedStyle}>
              You can view or download a copy of the executed agreement, complete with recorded signature audit trails, using the link below.
            </Text>

            <Section style={buttonContainerStyle}>
              <Button style={buttonPrimaryStyle} href={downloadUrl}>
                View Executed Document
              </Button>
            </Section>

            <Hr style={dividerStyle} />

            <Text style={subLinkTextStyle}>
              If the button doesn't work, copy and paste this link into your browser:
              <br />
              <Link href={downloadUrl} style={linkStyle}>
                {downloadUrl}
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerContainerStyle}>
            <Text style={footerLegalStyle}>
              © {new Date().getFullYear()} {companyName} Inc. All rights reserved.
              <br />
              This is an automated notification from your document management system.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ContractSignedCompletedEmail;