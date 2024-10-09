export default function welcomeEmailTemplate(name: string) {
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
            <p>Hello ${name},</p>
            <p>Thank you for applying for the <strong>Elite Global AI Free Training Program</strong>. We are excited to have you on board as you embark on this journey to enhance your AI skills and expand your professional network.</p>
            <p>To get access to our Externship platform, you're required to pay <strong>$10 instead of $15</strong> as an onboarding fee. This discount is only applicable to those who take the training.</p>
            <p>Join our Global Workforce by taking the Externship program, which is aimed at building your professional experience and portfolio.</p>
            <p>Please keep an eye on your inbox, as we will be sending important updates and further information about the training schedule, program materials, and other relevant details soon.</p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>We look forward to seeing you in the training.</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Elite Global AI Training Program. All rights reserved.</p>
            <p><a href="mailto:support@eliteglobalai.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>

  `;
}
