const externshipPlatformLink = "www.elitegloblinternships.com";
const couponCode = "UB699PRD";
const communityLink = "https://chat.whatsapp.com/Ef2A6VazyWa9ME0IVKPR86";
const onboardingVideoLink = "https://youtu.be/3_yS-XhzNpI";

type emailContent = "text" | "html";

export default function externshipEmailTemplate(
  participantName: string,
  externshipName: string,
  referralLink: string,
  type: emailContent
) {
  if (type == "text") {
    return `Welcome to Elite Global Intelligence Technologies (EGIT) Internships!

    Dear ${participantName},
    
    Congratulations on successfully completing your payment and securing your spot in the EGIT Internship Program! We're thrilled to have you on board.
    
    We are excited to inform you that your internship officially starts on November 14th, 2024. On that day, all internship courses and materials will be unlocked for access. Please refrain from trying to unlock the courses before this date, as the system might prompt you to pay again. Rest assured, all courses will be accessible without issue starting from November 14th.
    
    Here is the link to the EGIT Internship Platform:
    www.elitegloblinternships.com
    
    Additionally, as part of your enrollment, here is your personal referral link:
    ${referralLink}
    
    You can use this link to refer others to the paid internship and the EliteAI paid training program.
    
    On the day of the internship launch, you will receive an onboarding email with all the necessary instructions on how to get started. This will guide you through the platform, the curriculum, and any other relevant information to ensure a smooth experience.
    
    If you have any questions before the program begins, feel free to reach out. We look forward to your participation and the value you’ll bring to this exciting journey!
    
    Best regards,
    Ikpia Blessing Isioma
    Marketing Director
    Elite Global Intelligence Technologies (EGIT)
    +2349058522159, +2349156109492
    `;
  } else {
    return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to EGIT Internships</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
    <h2 style="color: #2c3e50;">Welcome to Elite Global Intelligence Technologies (EGIT) Internships!</h2>

    <p>Dear <strong>${participantName}</strong>,</p>

    <p>Congratulations on successfully completing your payment and securing your spot in the <strong>EGIT Internship Program</strong>! We're thrilled to have you on board.</p>

    <p>We are excited to inform you that your internship officially starts on <strong>November 14th, 2024</strong>. On that day, all internship courses and materials will be unlocked for access. Please refrain from trying to unlock the courses before this date, as the system might prompt you to pay again. Rest assured, all courses will be accessible without issue starting from November 14th.</p>

    <p>Here is the link to the EGIT Internship Platform:</p>
    <p><a href="http://www.elitegloblinternships.com" style="color: #3498db;">www.elitegloblinternships.com</a></p>

    <p>Additionally, as part of your enrollment, here is your personal referral link:</p>
    <p><a href="${referralLink}" style="color: #e74c3c;">${referralLink}</a></p>

    <p>On the day of the internship launch, you will receive an onboarding email with all the necessary instructions on how to get started. This will guide you through the platform, the curriculum, and any other relevant information to ensure a smooth experience.</p>

    <p>If you have any questions before the program begins, feel free to reach out. We look forward to your participation and the value you’ll bring to this exciting journey!</p>

    <p>Best regards,<br>
    <strong>Ikpia Blessing Isioma</strong><br>
    Marketing Director<br>
    Elite Global Intelligence Technologies (EGIT)<br>
    +2349058522159, +2349156109492</p>
  </div>
</body>
</html>

    `;
  }
}
