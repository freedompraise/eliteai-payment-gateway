export default function welcomeEmailTemplate(name: string, ref: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Elite Global AI Training Program</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .email-header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eeeeee;
          }
          .email-header h1 {
              font-size: 24px;
              color: #333333;
          }
          .email-content {
              margin-top: 20px;
              font-size: 16px;
              line-height: 1.6;
              color: #555555;
          }
          .email-content strong {
              color: #d9534f;
          }
          .email-footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #888888;
          }
          .email-footer a {
              color: #007BFF;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <h1>Welcome to the Elite Global AI Training Program</h1>
          </div>
          <div class="email-content">
              <p>Hello Dear,</p>
              <p>Thank you for applying to the <strong>Elite Global AI Free Training Program</strong>! We're thrilled to have you on board and eager to see you enhance your AI skills and expand your professional network.</p>
              
              <p><strong>Exclusive Discount</strong></p>
              <p>As a valued participant, you're eligible for a discounted onboarding fee of <strong>N16,000 ($10)</strong> instead of <strong>N24,000 ($15)</strong> for our Externship platform. This offer is only available to those who take the training.</p>
              
              <p>Be among the first 100 participants to pay the <strong>N16,000 ($10)</strong> Externship onboarding fee and receive <strong>N80,000 ($50)</strong> refund after the Externship Onboarding.</p>
              
              <p>Our Externship program is designed to build your professional experience and portfolio. This is an opportunity to join our Global workforce, which offers numerous benefits, such as:</p>
              <ul>
                  <li>Gaining hands-on experience</li>
                  <li>Enhancing your skills</li>
                  <li>Expanding your network</li>
              </ul>
  
              <p><strong>Keep an eye on your inbox for:</strong></p>
              <ul>
                  <li>Training schedule</li>
                  <li>Program materials</li>
                  <li>Relevant details</li>
              </ul>
  
              <p><strong>Referral Opportunity</strong></p>
              <p>Share the excitement! Use your unique referral link: <a href="${ref}">${ref}</a></p>
  
              <p>Refer 10 people to the training program and get <strong>N1,000</strong>.</p>
              <p>For each referral who pays the Externship onboarding fee, you'll earn a <strong>20% commission</strong>.</p>
              <p>Hit a milestone of 150 referrals who pay for the Externship Onboarding fee and receive <strong>N1,000,000 ($650)</strong>.</p>
  
              <p>Pay the discounted onboarding fee and begin your Externship journey.</p>
          </div>
          <div class="email-footer">
              <p>Best regards,</p>
              <p><strong>Elite Global AI Team</strong></p>
              <p>&copy; 2024 Elite Global AI Training Program. All rights reserved.</p>
              <p><a href="mailto:support@eliteglobalai.com">Contact Support</a></p>
          </div>
      </div>
  </body>
  </html>
  

  `;
}
