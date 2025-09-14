const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="prose prose-slate max-w-none text-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Who We Are</h2>
            <p>
              BleemHire is a platform that helps users find visa-sponsored job opportunities in the United States and United Kingdom by providing access to a searchable database of verified roles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">2. What Data We Collect</h2>
            <p className="mb-4">We may collect the following personal data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Basic Information:</strong> Name, email address, and payment details.</li>
              <li><strong>Account Information:</strong> Login credentials and usage data for accessing the database.</li>
              <li><strong>Payment Information:</strong> Processed securely through our third-party payment processor, Stripe.</li>
              <li><strong>Communication Data:</strong> Messages or feedback you provide, including your onboarding form data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">3. How We Use Your Data</h2>
            <p className="mb-4">We process your data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide access to our searchable database.</li>
              <li>Process payments and subscriptions.</li>
              <li>Troubleshoot technical issues and improve the performance of our platform.</li>
              <li>Send service updates and important notifications.</li>
              <li>Send promotional or marketing communications if you have opted in.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Legal Basis for Processing Your Data</h2>
            <p className="mb-4">We process your data under the following legal bases as required by GDPR:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Contractual Necessity:</strong> To provide access to our database and process payments.</li>
              <li><strong>Consent:</strong> For sending marketing communications.</li>
              <li><strong>Legitimate Interest:</strong> To improve our platform and ensure the security of your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Who We Share Your Data With</h2>
            <p className="mb-4">We may share your data with the following parties:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Payment Processor:</strong> Stripe, for secure payment processing.</li>
              <li><strong>Service Providers:</strong> Hosting providers (e.g. Cloudflare, Supabase, Algolia & Tilda) to host our database and website.</li>
            </ul>
            <p className="mt-4">We do not sell or rent your data to third parties.</p>
            <p className="mt-4">
              <strong>International Data Transfers:</strong> If you are located in the European Economic Area (EEA), your data may be transferred to and processed in countries outside of the EEA, including the United States, where data protection laws may be different from those in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Your Rights</h2>
            <p className="mb-4">Under GDPR, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access, update, or delete your personal data.</li>
              <li>Withdraw consent for processing your data at any time.</li>
              <li>File a complaint with your local data protection authority if you believe your rights have been violated.</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact info@bleemhire.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">7. Data Retention</h2>
            <p>
              We retain your data only as long as necessary for the purposes outlined in this Privacy Policy or to comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">8. Data Security</h2>
            <p className="mb-4">We take the following measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption of sensitive data during transmission (e.g., SSL/TLS).</li>
              <li>Regular security audits of our systems.</li>
              <li>Restricted access to personal data, limited to authorized personnel only.</li>
            </ul>
            <p className="mt-4 mb-4"><strong>Data Breach Notification:</strong></p>
            <p>
              In the unlikely event of a data breach, we will notify affected users and relevant authorities within 72 hours, as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">9. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
            </p>
            <p className="mt-4 mb-4"><strong>Notification of Changes:</strong></p>
            <p>
              If we make significant changes, we will notify you via email or through a prominent notice on our website at least 14 days before the changes take effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please email info@bleemhire.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;