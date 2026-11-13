import { Legal, type LegalSection } from "./Legal";

const sections: LegalSection[] = [
  ["What we store", "This site does not use advertising or analytics cookies. We use your browser's local storage for two essential settings only: the currency you choose for prices, and your answer to the cookie notice. Your language is part of the page address, so it needs no storage."],
  ["Admin and client portal", "If you sign in to our admin area, a secure, HTTP-only session cookie keeps you signed in. Client portal links use a private token in the address instead of cookies."],
  ["Analytics", "If we add privacy-friendly analytics in future, this policy will be updated before it is enabled."],
  ["Managing storage", "You can clear or block site data in your browser settings at any time. The site will still work; it simply won't remember your currency choice."],
];

export default function Cookies() {
  return <Legal updated="November 14, 2026" title="Cookie Policy" description="The limited browser storage CubicTech uses, and how to control it." sections={sections} />;
}
