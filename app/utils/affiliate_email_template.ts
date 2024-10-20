export default function affiliateEmailTemplate(
  type: "text" | "html",
  name: string,
  ref: string
) {
  if (type == "text") {
    return `
Hi ${name},

We hope this message finds you well!

We’re excited to provide you with your personal referral code for the EliteAI Paid Internship. This code allows you to refer others to our exclusive EliteAI paid training program, even if you are not enrolled yourself, giving you the opportunity to earn rewards as an affiliate.

Your Referral Link: ${ref}

By sharing this link, you’ll be able to introduce others to world-class AI training while helping them take their first step into an exciting future in AI. We appreciate your support and are thrilled to have you as a partner in this initiative.

If you have any questions or need further assistance, don’t hesitate to reach out to us.

Warm regards,  
The EliteAI Team

    `;
  } else {
    return `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Referral Code for the EliteAI Paid Internship</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
        <h2 style="color: #333;">Your Referral Code for the EliteAI Paid Internship</h2>

        <p>Hi <strong>${name}</strong>,</p>

        <p>We hope this message finds you well!</p>

        <p>We’re excited to provide you with your personal referral code for the <strong>EliteAI Paid Internship</strong>. This code allows you to refer others to our exclusive EliteAI paid training program, even if you are not enrolled yourself, giving you the opportunity to earn rewards as an affiliate.</p>

        <p><strong>Your Referral Link:</strong> <a href="${ref}" style="color: #1a73e8;">${ref}</a></p>

        <p>By sharing this link, you’ll be able to introduce others to world-class AI training while helping them take their first step into an exciting future in AI. We appreciate your support and are thrilled to have you as a partner in this initiative.</p>

        <p>If you have any questions or need further assistance, don’t hesitate to reach out to us.</p>

        <p>Warm regards,<br>The EliteAI Team</p>
      </td>
    </tr>
  </table>
</body>
</html>

            
            `;
  }
}
