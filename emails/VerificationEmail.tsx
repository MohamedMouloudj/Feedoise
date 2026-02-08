interface VerificationEmailProps {
  verifyLink: string;
  userName: string;
  expiryHours: number;
}

export default function VerificationEmail({
  verifyLink,
  userName,
  expiryHours = 24,
}: VerificationEmailProps): string {
  return `<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background-color:rgb(243,244,246);font-family:ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';padding-top:40px;padding-bottom:40px">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:rgb(255,255,255);margin-left:auto;margin-right:auto;padding-left:48px;padding-right:48px;padding-top:20px;padding-bottom:20px;margin-bottom:64px;max-width:37.5em">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:24px;font-weight:700;margin-top:40px;margin-bottom:20px;color:rgb(0,0,0);line-height:24px">
                      Feedoise
                    </p>
                    <p style="font-size:20px;font-weight:600;margin-bottom:15px;color:rgb(0,0,0);line-height:24px;margin-top:16px">
                      Verify your email address
                    </p>
                    <p style="font-size:16px;line-height:26px;color:rgb(31,41,55);margin-top:16px;margin-bottom:16px">
                      Hello ${userName},
                    </p>
                    <p style="font-size:16px;line-height:26px;color:rgb(31,41,55);margin-top:16px;margin-bottom:16px">
                      Thank you for signing up for Feedoise! To complete your registration, please verify your email address by clicking the button below.
                    </p>
                    <a href="${verifyLink}" style="background-color:rgb(37,99,235);color:rgb(255,255,255);font-size:16px;font-weight:600;text-decoration-line:none;text-align:center;display:block;width:100%;padding-left:20px;padding-right:20px;padding-top:12px;padding-bottom:12px;margin-top:24px;margin-bottom:24px;box-sizing:border-box;line-height:100%;text-decoration:none;max-width:100%;mso-padding-alt:0px" target="_blank">
                      <span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span>
                      <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Verify Email Address</span>
                      <span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span>
                    </a>
                    <p style="font-size:16px;line-height:26px;color:rgb(31,41,55);margin-top:16px;margin-bottom:16px">
                      If the button above does not work, you can also copy and paste the following link into your browser:
                    </p>
                    <a href="${verifyLink}" style="color:rgb(59,130,246);font-size:14px;text-decoration-line:underline;word-break:break-all" target="_blank">${verifyLink}</a>
                    <hr style="border-color:rgb(229,231,235);margin-top:32px;margin-bottom:32px;width:100%;border:none;border-top:1px solid #eaeaea" />
                    <p style="color:rgb(107,114,128);font-size:14px;line-height:20px;margin-top:8px;margin-bottom:8px">
                      This verification link will expire in ${expiryHours} hours for security reasons.
                    </p>
                    <p style="color:rgb(107,114,128);font-size:14px;line-height:20px;margin-top:8px;margin-bottom:8px">
                      If you did not create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
}
