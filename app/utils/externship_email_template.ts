const externshipPlatformLink = "www.elitegloblinternships.com";
const couponCode = "theway098H";
const communityLink = "";
const onboardingVideoLink = "https://youtu.be/zpdwnOA70FA";

type emailContent = "text" | "html";

export default function externshipEmailTemplate(
  participantName: string,
  referralLink: string,
  type: emailContent,
  program: string
) {
  if (type == "text") {
    return `Subject: Welcome to Elite Global Intelligence Technologies (EGIT) Internships!

    Dear ${participantName},
    
    Congratulations on successfully completing your payment for the ${program} at Elite Global Intelligence Technologies (EGIT)! We're excited to have you on board and can't wait to see your growth throughout this journey.
    
    Here’s What to Do Next:
    1️⃣ Access the EGIT Internship Platform:
    www.elitegloblinternships.com
    
    2️⃣ Your Unique Referral Link (Earn 20% Commission!):
    Refer your friends and colleagues using this link and earn 20% commission per successful referral:
    ${referralLink}
    
    3️⃣ Join the EGIT Internship Community:
    Connect with fellow interns, ask questions, and stay updated on program activities:
    ${communityLink}
    
    4️⃣ Watch This Quick Tutorial to Get Started:
    ${onboardingVideoLink}
    
    5️⃣ Unlock Your Externship with This Coupon Code:
    🔑 ${couponCode} (Valid for 24 hours)
    
    Internship Timeline & Expectations
    📌 Your Internship Program: ${program}
    📅 Start Date: Immediately
    
    ✅ Phase One (First Two Weeks):
    • Score 90%+ on internship tasks
    • Post/share your learning journey on two social media platforms daily (excluding weekends)
    • Complete your internship projects within two weeks to proceed to the next phase
    
    ✅ Phase Two (Next Two Weeks):
    • Work on portfolio-building projects
    • Engage with mentors for expert guidance
    
    Completion Benefits
    🎓 After Phase One: Receive a Certificate of Completion
    
    🌟 After Full Completion: Earn a Professional Recommendation Letter to enhance your career opportunities!
    
    If you have any questions, feel free to reach out—we're here to support you! Looking forward to seeing your success in ${program}.
    
    Best regards,
    Ikpia Blessing Isioma
    📞 +2349156109492, +2349058522159
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
          display: inline-block;
          background-color: #0073e6;
          color: white;
          padding: 10px 15px;
          text-decoration: none;
          border-radius: 5px;
          margin: 5px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888;
          text-align: center;
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
    
          <p>Congratulations on successfully completing your payment for the <strong>${program}</strong> at <strong>Elite Global Intelligence Technologies (EGIT)!</strong> We're thrilled to have you on board.</p>
    
          <h3>Here’s What to Do Next:</h3>
    
          <p><strong>1️⃣ Access the EGIT Internship Platform:</strong></p>
          <a href="https://www.elitegloblinternships.com" class="button">Visit the Internship Platform</a>
    
          <p><strong>2️⃣ Your Unique Referral Link (Earn 20% Commission!):</strong></p>
          <p>Refer your friends and colleagues and earn <strong>20% commission</strong> per successful referral:</p>
          <p><a href="${referralLink}"><strong>${referralLink}</strong></a></p>
    
          <p><strong>3️⃣ Join the EGIT Internship Community:</strong></p>
          <a href="${communityLink}" class="button">Join the Community</a>
    
          <p><strong>4️⃣ Watch This Quick Tutorial to Get Started:</strong></p>
          <a href="${onboardingVideoLink}" class="button">Watch Tutorial</a>
    
          <p><strong>5️⃣ Unlock Your Externship with This Coupon Code:</strong></p>
          <p><strong style="font-size: 20px;">🔑 ${couponCode}</strong> (Valid for 24 hours)</p>
    
          <h3>Internship Timeline & Expectations</h3>
    
          <p><strong>📌 Your Internship Program:</strong> ${program}</p>
          <p><strong>📅 Start Date:</strong> Immediately</p>
    
          <p><strong>✅ Phase One (First Two Weeks):</strong></p>
          <ul>
            <li>Score <strong>90%+</strong> on internship tasks</li>
            <li><strong>Post/share</strong> your learning journey on two social media platforms daily (excluding weekends)</li>
            <li>Complete your <strong>internship projects</strong> within two weeks to proceed to the next phase</li>
          </ul>
    
          <p><strong>✅ Phase Two (Next Two Weeks):</strong></p>
          <ul>
            <li>Work on <strong>portfolio-building projects</strong></li>
            <li>Engage with <strong>mentors</strong> for expert guidance</li>
          </ul>
    
          <h3>Completion Benefits</h3>
          <ul>
            <li><strong>🎓 After Phase One:</strong> Receive a <strong>Certificate of Completion</strong></li>
            <li><strong>🌟 After Full Completion:</strong> Earn a <strong>Professional Recommendation Letter</strong> to enhance your career opportunities</li>
          </ul>
    
          <p>If you have any questions, feel free to reach out—we're here to support you! Looking forward to seeing your success in <strong>${program}</strong>.</p>
        </div>
    
        <div class="footer">
          <p>Best regards,</p>
          <p><strong>Ikpia Blessing Isioma</strong></p>
          <p>📞 +2349156109492, +2349058522159</p>
          <p>Marketing Director</p>
          <p>Elite Global Intelligence Technologies (EGIT)</p>
        </div>
      </div>
    
    </body>
    </html>
    
    `;
  }
}
