import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All contact fields are required." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const isSMTPConfigured = host && user && pass;

    const emailContent = `
      <h3>New Inquiry from Living Law Website</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    if (isSMTPConfigured) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"${name}" <${user}>`,
        to: "livinglaw01@gmail.com",
        replyTo: email,
        subject: `[Living Law Form] ${subject}`,
        html: emailContent,
      });

      return NextResponse.json({ success: true, message: "Email sent successfully." });
    } else {
      // Sandbox fallback mode - log to console
      console.log("\n=================== SIMULATED EMAIL ===================");
      console.log(`To: livinglaw01@gmail.com`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Phone: ${phone}`);
      console.log(`Subject: [Living Law Form] ${subject}`);
      console.log(`Body:\n${message}`);
      console.log("========================================================\n");
      console.log("Tip: Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars in .env to send real emails.");

      return NextResponse.json({ 
        success: true, 
        message: "Message processed successfully (Simulated mode).",
        simulated: true 
      });
    }
  } catch (error: any) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { error: "Failed to process message: " + error.message },
      { status: 500 }
    );
  }
}
