import { Resend } from "resend";

// RESEND_API_KEY is optional at boot on purpose — EmailService checks for it
// and skips sending (rather than throwing) so local dev without a key still
// works for everything except actual email delivery.
export const resend = new Resend(process.env.RESEND_API_KEY ?? "re_dev_placeholder");
