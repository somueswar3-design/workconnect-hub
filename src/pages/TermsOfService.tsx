const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <div className="container py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2 text-white">Terms of Service</h1>
        <p className="text-slate-400 mb-10">Last updated: March 13, 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using WorkSupport360 ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including freelancers, clients, and visitors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              WorkSupport360 is a privacy-first IT freelancing platform that connects IT professionals (Freelancers) with businesses and individuals (Clients) seeking IT support. Our services include profile management, project matching, communication tools, and payment facilitation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>One person may not maintain more than one active account per role</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Freelancer Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate information about your skills, experience, and qualifications</li>
              <li>Deliver work as agreed upon with clients in a professional and timely manner</li>
              <li>Maintain professional communication with clients through the platform</li>
              <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              <li>Not engage in any fraudulent or deceptive practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Client Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide clear project requirements and expectations</li>
              <li>Make timely payments for completed work as per agreed terms</li>
              <li>Respect the privacy and alias settings of freelancers</li>
              <li>Not attempt to circumvent the platform for direct hiring without agreement</li>
              <li>Provide honest and fair feedback and ratings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Privacy & Alias Usage</h2>
            <p>
              WorkSupport360 allows freelancers to operate under alias names. Users must not attempt to discover or disclose the real identity of any user operating under an alias. Violation of this policy may result in immediate account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Payments & Fees</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>WorkSupport360 may charge service fees for facilitating transactions</li>
              <li>All payment terms will be clearly communicated before any transaction</li>
              <li>Freelancers set their own hourly rates and project fees</li>
              <li>Disputes regarding payments should be reported to our support team promptly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Intellectual Property</h2>
            <p>
              Unless otherwise agreed, intellectual property rights for work created by freelancers are transferred to the client upon full payment. The WorkSupport360 platform, its branding, design, and technology remain the exclusive property of Mahvenx IT Solutions Pvt Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Prohibited Activities</h2>
            <p className="mb-3">Users must not:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the platform for any illegal or unauthorized purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload malicious software or content</li>
              <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
              <li>Manipulate ratings, reviews, or feedback</li>
              <li>Spam or send unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time if you violate these Terms of Service. You may also delete your account at any time. Upon termination, your right to use the platform ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">11. Limitation of Liability</h2>
            <p>
              WorkSupport360 acts as a platform connecting freelancers and clients. We are not responsible for the quality of work delivered, disputes between users, or any damages arising from the use of our services. Our liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">12. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">13. Contact Us</h2>
            <p>
              For any questions regarding these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <strong className="text-white">Email:</strong> info@worksupport360.com<br />
              <strong className="text-white">Phone:</strong> 9441363687<br />
              <strong className="text-white">Location:</strong> India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
