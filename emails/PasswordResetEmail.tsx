import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
  Hr,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetLink: string;
  userName: string;
  expiryMinutes: number;
}

export default function PasswordResetEmail({
  resetLink,
  userName,
  expiryMinutes = 10,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Feedoise</Text>
            <Text style={title}>Reset your password</Text>
            <Text style={text}>Hello {userName},</Text>
            <Text style={text}>
              We received a request to reset the password for your Feedoise
              account. Click the button below to create a new password.
            </Text>
            <Button href={resetLink} style={button}>
              Reset Password
            </Button>
            <Text style={text}>
              If the button above does not work, you can also copy and paste the
              following link into your browser:
            </Text>
            <Link href={resetLink} style={link}>
              {resetLink}
            </Link>
            <Hr style={hr} />
            <Text style={footer}>
              This password reset link will expire in {expiryMinutes} minutes
              for security reasons.
            </Text>
            <Text style={footer}>
              If you did not request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  color: "#000000",
};

const title = {
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 15px",
  color: "#000000",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 20px",
  margin: "24px 0",
};

const link = {
  color: "#067df7",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};
