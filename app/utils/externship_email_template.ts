const externshipPlatformLink = "www.elitegloblinternships.com";
const couponCode = "HQZNSHV9";
const communityLink = "https://chat.whatsapp.com/FXhmF59Xllp9CEsKt5fGeg";
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
    
    Here is the link to the EGIT Internship Platform:
    https://www.elitegloblinternships.com
    
    As part of Internship program , you're required to register for the free upcoming training here:-
    https://registration.elitegloblinternships.com/free_training
    
    Your unique referral link is included below, which you can share with friends and colleagues who may be interested in joining the program:
    ${referralLink}
    You get 20% commission upon every referral.
    
    We also invite you to join the EGIT Internship Community, where you can connect with fellow interns, ask questions, and stay updated on all program activities:
    ${communityLink}
    
    To help you get started, here's a YouTube video tutorial that will guide you through the process:
    ${onboardingVideoLink}
    
    Use the following coupon code to unlock your externship:
    ${couponCode}.
    Please use the code within the first 24 hours.
    
    Internship starts immediately.

    Criteria for qualifying for the #80,000 cash reward is:

    - During the Internship task, have a high score (90% and above)
    - Post/share your learning journey on 2 social media platforms daily excluding weekends.
    - Complete your Internship projects in 2 weeks, so you can proceed with the other phase of the Internship.

     The Second phase entails a two weeks period of building Portfolio projects, and Interacting with mentors.
    
    If you have any questions, feel free to reach out. We look forward to your participation and the value you’ll bring to this exciting journey!
    
    Best regards,
    Ikpia Blessing Isioma
    +2349156109492, +2349058522159
    Marketing Director
    Elite Global Intelligence Technologies (EGIT)
    
    `;
  } else {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to EGIT Internships</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #ddd;
    }
    .header {
      background-color: #0073e6;
      color: white;
      padding: 10px;
      text-align: center;
    }
    .content {
      margin: 20px 0;
    }
    .button {
      background-color: #0073e6;
      color: white;
      padding: 10px 15px;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Welcome to Elite Global Intelligence Technologies (EGIT) Internships!</h1>
    </div>

    <div class="content">
      <p>Dear <strong>${participantName}</strong>,</p>

      <p>Congratulations on successfully completing your payment and securing your spot in the EGIT Internship Program! We're thrilled to have you on board.</p>

      <p>Here is the link to the EGIT Internship Platform:</p>
      <a href="https://www.elitegloblinternships.com" class="button">Visit the Internship Platform</a>

      <p>Your unique referral link is included below, which you can share with friends and colleagues who may be interested in joining the program:</p>
      <p><strong><a href="${referralLink}">${referralLink}</a></strong></p>

      <p>You get 20% commission upon every referral.</p>

      <p>We also invite you to join the EGIT Internship Community, where you can connect with fellow interns, ask questions, and stay updated on all program activities:</p>
      <a href="${communityLink}" class="button">Join the Community</a>

      <p>To help you get started, here's a YouTube video tutorial that will guide you through the process:</p>
      <a href="${onboardingVideoLink}" class="button">Watch Tutorial</a>

      <p>Use the following coupon code to unlock your externship:</p>
      <p><strong>${couponCode}</strong></p>
      <p><em>Please use the code within the first 12 hours.</em></p>

      <p>Externship starts immediately. If you can complete your externship by the end of this month, you’ll significantly increase your chances of receiving the $50 (₦80,000) payment.</p>

      <p>If you have any questions, feel free to reach out. We look forward to your participation and the value you’ll bring to this exciting journey!</p>
    </div>

    <div class="footer">
      <p>Best regards,</p>
      <p><strong>Ikpia Blessing Isioma</strong><br>+2349156109492, +2349058522159<br>Marketing Director<br>Elite Global Intelligence Technologies (EGIT)</p>
    </div>
  </div>

</body>
</html>

    `;
  }
}
