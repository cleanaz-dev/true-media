// lib/email/templates/register-email.tsx
import { Html, Body, Container, Text, Heading, Button } from 'react-email';

export function RegisterEmail({ name, body }: { name: string; body: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Welcome, {name}!</Heading>
          <Text>{body}</Text>
          <Button href="https://yourapp.com/login">Login</Button>
        </Container>
      </Body>
    </Html>
  );
}

export default RegisterEmail;
