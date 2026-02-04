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

interface VerificationEmailProps {
  verifyLink: string;
  userName: string;
}

export default function VerificationEmail({
  verifyLink,
  userName,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Feedoise</Text>
            <Text style={title}>Verify your email address</Text>
            <Text style={text}>Hello {userName},</Text>
            <Text style={text}>
              Thank you for signing up for Feedoise. To complete your
              registration, please verify your email address by clicking the
              button below.
            </Text>
            <Button href={verifyLink} style={button}>
              Verify Email Address
            </Button>
            <Text style={text}>
              If the button above does not work, you can also copy and paste the
              following link into your browser:
            </Text>
            <Link href={verifyLink} style={link}>
              {verifyLink}
            </Link>
            <Hr style={hr} />
            <Text style={footer}>
              If you did not create an account with Feedoise, you can safely
              ignore this email.
            </Text>
            <Text style={footer}>
              This link will expire in 24 hours for security reasons.
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
