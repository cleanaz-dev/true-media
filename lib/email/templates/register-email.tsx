// lib/email/templates/register-email.tsx
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
  headingSmStyle,
  textStyle,
  textMutedStyle,
  buttonContainerStyle,
  buttonPrimaryStyle,
  dividerStyle,
  footerContainerStyle,
  footerLegalStyle,
} from "@/lib/email/styles";

export interface RegisterEmailProps {
  name: string;
}

export function RegisterEmail({ name }: RegisterEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          
          {/* Corporate Header */}
          <Section style={headerContainerStyle}>
            <Text style={headerLogoStyle}>True Media Studios</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={companyBadgeStyle}>Account Created</Text>
            
            <Heading style={headingStyle}>Welcome, {name}!</Heading>

            <Text style={textStyle}>
              Your account has been successfully created. You now have access to book office space, manage your reservations, and explore available rooms across our facilities.
            </Text>

            <Heading as="h2" style={headingSmStyle}>
              What's Next?
            </Heading>

            <Text style={textStyle}>
              Head over to the rooms portal to browse availability, check amenities, and reserve your preferred space.
            </Text>

            <Section style={buttonContainerStyle}>
              <Button
                style={buttonPrimaryStyle}
                href="https://truemediasports.com/rooms"
              >
                Browse Rooms & Book Space
              </Button>
            </Section>

            <Text style={textMutedStyle}>
              You can also return to this page anytime by visiting{" "}
              <Link
                href="https://truemediasports.com/rooms"
                style={{ color: "#2563eb", textDecoration: "underline" }}
              >
                truemediasports.com/rooms
              </Link>
              .
            </Text>

            <Hr style={dividerStyle} />

            <Text style={textMutedStyle}>
              If you have any questions about your account or booking process, feel free to reach out to our team.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerContainerStyle}>
            <Text style={footerLegalStyle}>
              © {new Date().getFullYear()} True Media Studios. All rights reserved.
              <br />
              This email was sent to confirm your account registration.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default RegisterEmail;