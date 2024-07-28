export default function getEmailTemplate(username: string, ref: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Elite AI Referral</title>
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
          .referral-link {
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
              <h1>Welcome to Elite AI Ambassador Program!</h1>
              <p>Dear ${username},</p>
              <p>
                  We are excited to have you as part of our Elite AI community. As an ambassador, you have the unique opportunity to share the benefits of our ELITE GLOBAL AI FREE TRAINING + INTERNSHIP PROGRAM services with your friends and family. By referring them, you help us grow our community and empower more people with AI knowledge.
              </p>
              <p>
                  Here is your exclusive referral link:
              </p>
              <a href="${ref}" class="referral-link">
                  ${ref}
              </a>
              <p>
                  Share this link with anyone interested in participating in the ELITE GLOBAL AI FREE TRAINING + INTERNSHIP PROGRAM.
              </p>
              <p>
                  Thank you for being a part of Elite AI and helping us spread the knowledge!
              </p>
              <p>Best regards,</p>
              <p>The Elite AI Team</p>
          </div>
          <div class="footer">
              <p>
                  &copy; 2024 Elite AI. All rights reserved.<br>
                  
              </p>
          </div>
      </div>
  </body>
  </html>
    `;
}
