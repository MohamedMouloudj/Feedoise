import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import { waitUntil } from "@vercel/functions";
import { prisma } from "./db";
import { nextCookies } from "better-auth/next-js";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import VerificationEmail from "@/emails/VerificationEmail";
import {
  EMAIL_VERIFICATION_EXPIRY_HOURS,
  PASSWORD_RESET_EXPIRY_MINUTES,
} from "@/config/const";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const baseUrl = url.split("?")[0];
      const verifyLink = `${baseUrl}?token=${token}&callbackURL=/onboarding`;

      const userName = user.name || user.email.split("@")[0];

      const emailHtml = VerificationEmail({
        verifyLink,
        userName,
        expiryHours: EMAIL_VERIFICATION_EXPIRY_HOURS,
      });

      const sendEmail = async () => {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Verify your email - Feedoise",
            html: emailHtml,
            headers: {
              "X-Entity-Ref-ID": `feedoise-email-verification-${Date.now()}`,
            },
            // tags are for Resend analytics. See https://resend.com/docs/email-analytics
            tags: [
              { name: "category", value: "confirm_email" },
              {
                name: "environment",
                value: process.env.NODE_ENV || "development",
              },
            ],
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
        }
      };

      if (typeof waitUntil !== "undefined") {
        waitUntil(sendEmail());
      } else {
        await sendEmail();
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * EMAIL_VERIFICATION_EXPIRY_HOURS,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const resetLink = url;
      const userName = user.name || user.email.split("@")[0];

      const emailHtml = PasswordResetEmail({
        resetLink,
        userName,
        expiryMinutes: PASSWORD_RESET_EXPIRY_MINUTES,
      });

      const sendEmail = async () => {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "Reset your password - Feedoise",
            html: emailHtml,
            headers: {
              "X-Entity-Ref-ID": `feedoise-password-reset-${Date.now()}`,
            },
            tags: [
              { name: "category", value: "password-reset" },
              {
                name: "environment",
                value: process.env.NODE_ENV || "development",
              },
            ],
          });
        } catch (error) {
          console.error("Failed to send password reset email:", error);
        }
      };

      if (typeof waitUntil !== "undefined") {
        waitUntil(sendEmail());
      } else {
        await sendEmail();
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      preferredLanguage: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
