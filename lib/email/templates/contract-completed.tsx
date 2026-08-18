import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Section,
} from "react-email";

export function ContractSignedCompletedEmail({
  recipientName,
  contractTitle,
  downloadUrl,
}: {
  recipientName: string;
  contractTitle: string;
  downloadUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif", padding: "40px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "8px", maxWidth: "560px", border: "1px solid #e5e7eb" }}>
          <Heading style={{ fontSize: "20px", color: "#166534" }}>
            ✓ Contract Fully Executed
          </Heading>
          <Text style={{ fontSize: "15px", color: "#374151" }}>
            Hello {recipientName},
          </Text>
          <Text style={{ fontSize: "15px", color: "#374151" }}>
            All required parties have signed <strong>{contractTitle}</strong>. A sealed copy of the completed document with the audit trail is now available for your records.
          </Text>

          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={downloadUrl}
              style={{
                backgroundColor: "#166534",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Download Executed PDF
            </Button>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />
          <Text style={{ fontSize: "12px", color: "#6b7280" }}>
            This document was signed electronically in compliance with digital signature regulations.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContractSignedCompletedEmail;