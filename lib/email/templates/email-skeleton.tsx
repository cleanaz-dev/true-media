import { Html, Head, Body, Container, Section, Img, Hr, Text } from 'react-email';
import { Markdown } from 'react-email';


interface EmailSkeletonProps {
  compiledMarkdown: string; 
}

export default function EmailSkeleton({ compiledMarkdown }: EmailSkeletonProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Global Header / Logo */}
          <Img 
            src="https://yourdomain.com/logo.png" 
            width="150" 
            height="50" 
            alt="My Booking SaaS Logo" 
          />
          
          {/* Dynamic Content */}
          <Section style={contentSection}>
            <Markdown>{compiledMarkdown}</Markdown>
          </Section>

          {/* Global Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} My Booking SaaS. All rights reserved.<br />
            123 Booking Street, Toronto, ON, Canada
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Basic styles
const main = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' };
const contentSection = { padding: '0 48px' };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const footer = { color: '#8898aa', fontSize: '12px', padding: '0 48px' };