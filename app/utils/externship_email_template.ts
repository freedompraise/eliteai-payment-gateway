const externshipPlatformLink = "www.elitegloblinternships.com";
const couponCode = "PEZ45444";
const communityLink = "https://chat.whatsapp.com/Ef2A6VazyWa9ME0IVKPR86";
const onboardingVideoLink = "https://youtu.be/FvZtogDQAkI";

type emailContent = "text" | "html";

export default function externshipEmailTemplate(
  participantName: string,
  externshipName: string,
  referralLink: string,
  type: emailContent
) {
  if (type == "text") {
    return `
        Dear ${participantName},

Congratulations on securing a spot in the ${externshipName} at Elite Global AI! We are thrilled to have you on board and look forward to supporting you as you grow your skills in this exciting field.

Here's what you need to get started:

Your Referral Link:
Share your unique referral link to invite others to join the program and build your network:
${referralLink}

Access the Externship Platform:
Click the link below to access the externship platform, where all your learning materials and tasks will be available:
${externshipPlatformLink}

Join the Externship Community:
https://chat.whatsapp.com/Ef2A6VazyWa9ME0IVKPR86

Unlock Your Externship:
To unlock your externship, please use this coupon code at checkout:
${couponCode}

Watch the Onboarding Video:
We’ve created a short video to walk you through the entire process—from signing in to navigating the platform. Watch it here:
${onboardingVideoLink}

Feel free to reach out if you have any questions or need assistance along the way. We're here to ensure you have the best learning experience possible.

Once again, welcome to the ${externshipName}! We’re excited to see all that you’ll accomplish.

Best regards,
Ikpia Blessing Isioma
Marketing Director, Elite Global AI
[+2349058522159]

        `;
  } else {
    return `
          <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Elite Global AI Externship</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  background-color: #ffffff;
                  margin: 0 auto;
                  padding: 20px;
                  max-width: 600px;
                  border: 1px solid #dddddd;
                  border-radius: 8px;
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
              }
              .header img {
                  max-width: 150px;
              }
              .content {
                  margin: 20px 0;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #666666;
                  line-height: 1.5;
              }
              .referral-link, .platform-link, .community-link, .coupon-code, .onboarding-video {
                  background-color: #007BFF;
                  color: #ffffff;
                  text-align: center;
                  padding: 10px;
                  border-radius: 4px;
                  text-decoration: none;
                  display: inline-block;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #999999;
                  padding: 20px 0;
              }
              .footer a {
                  color: #007BFF;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <img src="https://eliteai.com/logo.png" alt="Elite AI">
              </div>
              <div class="content">
                  <h1>Congratulations on Your Externship!</h1>
                  <p>Dear ${participantName},</p>
                  <p>
                      Congratulations on securing a spot in the ${externshipName} externship program at Elite Global AI! We are thrilled to have you on board and look forward to supporting you as you grow your skills in this exciting field.
                  </p>
                  <p>Here's what you need to get started:</p>
                  <p>
                      <strong>Your Referral Link:</strong><br>
                      Share your unique referral link to invite others to join the program and build your network:<br>
                      <a href="${referralLink}" class="referral-link">${referralLink}</a>
                  </p>
                  <p>
                      <strong>Access the Externship Platform:</strong><br>
                      Click the link below to access the externship platform, where all your learning materials and tasks will be available:<br>
                      <a href="${externshipPlatformLink}" class="platform-link">${externshipPlatformLink}</a>
                  </p>
                  <p>
                      <strong>Join the Externship Community:</strong><br>
                      <a href=${communityLink} class="community-link">Join the Community</a>
                  </p>
                  <p>
                      <strong>Unlock Your Externship:</strong><br>
                      To unlock your externship, please use this coupon code at checkout:<br>
                      <span class="coupon-code">${couponCode}</span>
                  </p>
                  <p>
                      <strong>Watch the Onboarding Video:</strong><br>
                      We’ve created a short video to walk you through the entire process—from signing in to navigating the platform. Watch it here:<br>
                      <a href="${onboardingVideoLink}" class="onboarding-video">${onboardingVideoLink}</a>
                  </p>
                  <p>
                      Feel free to reach out if you have any questions or need assistance along the way. We're here to ensure you have the best learning experience possible.
                  </p>
                  <p>Once again, welcome to the EliteAi ${externshipName} externship program! We’re excited to see all that you’ll accomplish.</p>
                  <p>Best regards,</p>
                  <p>Ikpia Blessing Isioma<br>Marketing Director, Elite Global AI<br>[+2349058522159]</p>
              </div>
              <div class="footer">
                  <p>
                      &copy; 2024 Elite Global AI. All rights reserved.<br>
                  </p>
              </div>
          </div>
      </body>
      </html>
      
          `;
  }
}
