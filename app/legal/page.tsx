"use client";

import NavBar from "@/components/Reuse/Navbar";
import Footer from "@/components/Reuse/Footer";
import Link from "next/link";

export default function LegalPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-white text-neutral-900">
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-10">
          <header className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-400">
              Terms of Use & Privacy Policy
            </h1>
            <p className="text-sm md:text-base text-neutral-700">
              This Terms of Use and Privacy Policy ("Agreement") explains how Tutera
              ("Tutera", "we", "our", or "us") provides its multi-tenant learning
              management platform (the "Platform") to institutions, instructors,
              creators and learners (collectively, "Users"). By creating an
              account, accessing, or using the Platform, you agree to this
              Agreement.
            </p>
          </header>

          {/* 1. Eligibility & Accounts */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Eligibility & Accounts</h2>
            <p className="text-sm md:text-base text-neutral-800">
              - You must be at least 18 years old, or the age of majority in your
              jurisdiction, to create an institution or instructor account.
              <br />- Learners under the age of majority may only use the Platform
              with the consent and under the supervision of a parent, guardian, or
              educational institution, where applicable.
              <br />- You are responsible for all activity that occurs under your
              account and for maintaining the confidentiality of your login
              credentials.
            </p>
          </section>

          {/* 2. Multi‑Tenant Use & Tenants */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Multi‑Tenant Use & Tenants</h2>
            <p className="text-sm md:text-base text-neutral-800">
              - The Platform is multi‑tenant: each institution or creator
              ("Tenant") operates a branded online academy within Tutera.
              <br />- Tenants manage their own learners, content, and branding and
              may set additional terms or policies that apply to their learners.
              <br />- Where there is a conflict between a Tenant&apos;s terms and this
              Agreement, this Agreement governs your relationship with Tutera.
            </p>
          </section>

          {/* 3. Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Acceptable Use</h2>
            <p className="text-sm md:text-base text-neutral-800">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-neutral-800">
              <li>Use the Platform for any unlawful, harmful, or fraudulent purpose.</li>
              <li>Upload or share content that is defamatory, abusive, obscene, hateful, or infringing.</li>
              <li>Attempt to gain unauthorized access to other tenants&apos; data or any non-public systems.</li>
              <li>Reverse engineer, decompile, or otherwise attempt to discover the source code of the Platform.</li>
            </ul>
          </section>

          {/* 4. Content & Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Content & Intellectual Property</h2>
            <p className="text-sm md:text-base text-neutral-800">
              - Tenants and instructors retain ownership of the learning content
              they upload to the Platform, subject to any agreements they have
              with their learners or partners.
              <br />- By uploading content, you grant Tutera a limited,
              non-exclusive, worldwide license to host, display, and distribute
              that content as necessary to operate the Platform and provide our
              services.
              <br />- The Platform, including all underlying software, design,
              and branding, is owned by Tutera and is protected by applicable
              intellectual property laws.
            </p>
          </section>

          {/* 5. Payments & Subscriptions */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Payments & Subscriptions</h2>
            <p className="text-sm md:text-base text-neutral-800">
              - Certain features of the Platform may be offered on a paid
              subscription or transactional basis.
              <br />- Fees, billing cycles, and refund rules may be described in
              the specific pricing plan or in a separate agreement between a
              Tenant and Tutera.
              <br />- Where payments are processed through third‑party payment
              providers, their terms and privacy policies also apply.
            </p>
          </section>

          {/* 6. Data Protection & Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Data Protection & Privacy</h2>
            <p className="text-sm md:text-base text-neutral-800">
              We are committed to protecting the privacy and security of your
              information. This section explains how we handle personal data on
              the Platform.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-neutral-800">
              <li>
                <span className="font-semibold">Data controllers.</span> For most
                learner data, the relevant Tenant (institution or creator) is the
                primary data controller. Tutera acts as a service provider /
                processor in relation to that data.
              </li>
              <li>
                <span className="font-semibold">Information we collect.</span> We
                may collect account information (such as name, email, password),
                tenant details (such as academy name, subdomain), usage data, and
                technical information (such as device, browser, IP address).
              </li>
              <li>
                <span className="font-semibold">How we use information.</span> We
                use personal data to operate and secure the Platform, create and
                manage tenant spaces, provide support, personalize experiences,
                and comply with legal obligations.
              </li>
              <li>
                <span className="font-semibold">Sharing.</span> We may share data
                with trusted service providers (such as hosting, analytics,
                communications, and payment processors) who process data on our
                behalf under appropriate safeguards.
              </li>
            </ul>
          </section>

          {/* 7. International Transfers */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. International Transfers</h2>
            <p className="text-sm md:text-base text-neutral-800">
              Because Tutera is a cloud-based Platform, your information may be
              processed in countries other than your own. We take reasonable
              steps to ensure that appropriate safeguards are in place when data
              is transferred across borders, in line with applicable data
              protection laws.
            </p>
          </section>

          {/* 8. Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Security</h2>
            <p className="text-sm md:text-base text-neutral-800">
              We implement technical and organizational measures designed to
              protect the Platform and your data against unauthorized access,
              loss, or misuse. However, no system is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          {/* 9. Data Retention */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Data Retention</h2>
            <p className="text-sm md:text-base text-neutral-800">
              We retain personal data for as long as necessary to provide the
              Platform, comply with legal obligations, resolve disputes, and
              enforce our agreements. Tenants may also define their own data
              retention practices for their learners.
            </p>
          </section>

          {/* 10. Your Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Your Rights</h2>
            <p className="text-sm md:text-base text-neutral-800">
              Depending on your location, you may have rights over your personal
              data, such as the right to access, correct, delete, restrict, or
              object to certain processing, and the right to data portability.
              Some of these rights may need to be exercised through your Tenant
              (e.g., your institution or instructor).
            </p>
          </section>

          {/* 11. Third‑Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">11. Third‑Party Services</h2>
            <p className="text-sm md:text-base text-neutral-800">
              The Platform may integrate with third‑party tools, such as video
              conferencing, content hosting, analytics, and payment gateways.
              Your use of those services is subject to their own terms and
              privacy policies, and we are not responsible for their practices.
            </p>
          </section>

          {/* 12. Suspension & Termination */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">12. Suspension & Termination</h2>
            <p className="text-sm md:text-base text-neutral-800">
              We may suspend or terminate access to the Platform, or to specific
              tenant environments, where we reasonably believe there is a
              violation of this Agreement, a security risk, non‑payment, or as
              required by law.
            </p>
          </section>

          {/* 13. Changes to this Agreement */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">13. Changes to this Agreement</h2>
            <p className="text-sm md:text-base text-neutral-800">
              We may update these Terms of Use and Privacy Policy from time to
              time. When we make material changes, we will take reasonable steps
              to notify you, such as updating the &quot;Last updated&quot; date,
              showing a notice in the Platform, or sending an email where
              appropriate. Your continued use of the Platform after changes take
              effect constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* 14. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">14. Contact</h2>
            <p className="text-sm md:text-base text-neutral-800">
              If you have any questions about these Terms of Use or our Privacy
              Policy, or if you wish to exercise your data protection rights,
              you can contact us at:
            </p>
            <p className="text-sm md:text-base text-neutral-800">
              <span className="font-semibold">Email:</span> tuteralms@gmail.com
            </p>
          </section>

          <p className="text-xs text-neutral-500 mt-4">
            This page is provided for general informational purposes and does
            not constitute legal advice. Tenants may supplement these terms with
            their own institution‑specific or program‑specific terms.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/signUp"
              className="inline-flex items-center justify-center rounded-lg bg-primary-400 px-6 py-2 text-sm font-semibold text-neutral-100 hover:bg-primary-500 transition-colors"
            >
              Back to sign up
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
