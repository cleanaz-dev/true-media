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

export interface ContractSignedCompletedEmailProps {
  recipientName: string;
  contractTitle: string;
  downloadUrl: string;
}

export function ContractSignedCompletedEmail({
  recipientName,
  contractTitle,
  downloadUrl,
}: ContractSignedCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>✓ Contract Fully Executed</Heading>

          <Text style={textStyle}>Hello {recipientName},</Text>

          <Text style={textStyle}>
            Great news! All required parties have signed{" "}
            <strong>{contractTitle}</strong>.
          </Text>

          <Text style={textStyle}>
            You can view or download a copy of the executed agreement with all
            recorded signature audit trails below:
          </Text>

          <Section style={buttonContainerStyle}>
            <Button style={buttonStyle} href={downloadUrl}>
              View Executed Document
            </Button>
          </Section>

          <Hr style={dividerStyle} />

          <Text style={footerTextStyle}>
            Direct link to document:
            <br />
            <Link href={downloadUrl} style={linkStyle}>
              {downloadUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContractSignedCompletedEmail;

// --- Styles ---
const mainStyle: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  maxWidth: "560px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#166534",
  marginTop: "0",
  marginBottom: "20px",
};

const textStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#374151",
  margin: "12px 0",
};

const buttonContainerStyle: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#166534",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontWeight: "500",
  fontSize: "15px",
  textDecoration: "none",
  display: "inline-block",
};

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid #e5e7eb",
  margin: "24px 0 16px 0",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  wordBreak: "break-all",
};