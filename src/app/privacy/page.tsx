import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import Link from 'next/link'

export default function Privacy() {
  return (
    <div className="flex flex-col items-center justify-center min-h-fit container mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2><strong>Last Updated: 2024-09-25</strong></h2>
          <br/>

          <p>
            In Moonsy&apos;s household (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), your privacy is important to us.
            This Privacy Policy outlines how we use cookies, interact with third-party APIs, and handle user data.
          </p>

          <br/>
          <h2><strong>1. Third-Party API Usage</strong></h2>
          <p>
            Our website uses a third-party API provided by Pokefarm.com to display user-friendly tools that enhance your Pok&eacute;Farm Q (PFQ) gameplay experience.
            This API allows read-only access to your PFQ account for these purposes. We do not collect, store, or process any personal data from you in relation to this API.
          </p>

          <br/>
          <h2><strong>2. Cookies</strong></h2>
          <p>
            We use cookies to enhance your experience by storing your preferences and settings on the client-side.
            These cookies are used solely to improve the functionality of the tools provided by our website, and no personal data is collected through cookies.
            <br/>
            Preference cookies are used to remember your settings on our website, such as display options or preferences related to PFQ gameplay tools.
          </p>

          <br/>
          <h2><strong>3. No Personal Data Collection</strong></h2>
          <p>
            Our website does not collect, store, or process any personal data from its users.
            We do not request any personal information such as your name, email address, or IP address.
          </p>

          <br/>
          <h2><strong>4. Compliance with GDPR</strong></h2>
          <p>
            Although we do not collect personal data, we respect the privacy of all visitors.
            We aim to maintain general compliance with the principles of the General Data Protection Regulation (GDPR).
          </p>

          <br/>
          <h2><strong>5. Changes to this Policy</strong></h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time.
            Any changes will be reflected on this page, and we recommend you review this policy periodically.
          </p>
        </CardContent>
      </Card>
      <br/>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2><strong>Last Updated: 2024-09-25</strong></h2>
          <br/>

          <p>
            This Cookies Policy explains how Moonsy&apos;s website (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), uses cookies and similar technologies to recognize you when you visit our website.
            &nbsp;It explains what these technologies are and why we use them, as well as your rights to control their use.
          </p>

          <br/>
          <h3><strong>1. What Are Cookies?</strong></h3>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            &nbsp;Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <br/>
          <h3><strong>2. How We Use Cookies</strong></h3>
          <p>
            We use cookies to improve your experience on our website by storing your preferences and settings. No personal data is stored or collected through these cookies.
            <br/>
            Preference cookies remember your settings and choices, such as display preferences, to improve your experience when using our website’s tools.
          </p>

          <br/>
          <h3><strong>3. Types of Cookies We Use</strong></h3>
          <p>
            Cookies that are set by us are first party and used to enhance your browsing experience on our website.
            &nbsp;They are used only to store preferences and settings and do not collect personal information.
          </p>

          <br/>
          <h3><strong>4. Your Cookie Choices</strong></h3>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.
            &nbsp;If you choose to reject cookies, you may still use our website, although your access to some functionality and areas of the website may be restricted.
          </p>

          <br/>
          <h3><strong>5. How to Control Cookies</strong></h3>
          <p>
            Most web browsers allow you to control cookies through your settings preferences. However, disabling cookies may impact your ability to use certain features of our website.
            &nbsp;Instructions for managing cookies in popular browsers can be found below:
          </p>

          <br/>
          <ul>
            <li><Link className="text-blue-500" href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</Link></li>
            <li><Link className="text-blue-500" href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</Link></li>
            <li><Link className="text-blue-500" href="https://support.microsoft.com/en-us/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer">Edge</Link></li>
            <li><Link className="text-blue-500" href="https://support.apple.com/en-gb/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</Link></li>
          </ul>

          <br/>
          <h3><strong>6. Changes to This Cookies Policy</strong></h3>
          <p>
            We may update this Cookies Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons.
            &nbsp;Please revisit this policy regularly to stay informed about our use of cookies.
          </p>
        </CardContent>
      </Card>
    </div>
  )
};