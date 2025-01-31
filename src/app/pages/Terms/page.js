import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8" style={{ marginTop: '120px' }}>
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Terms and Conditions for Bytezle – Online Gadget Shop
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please read these terms and conditions carefully before using our services.
                    </p>
                </div>
                <div className="card shadow-lg compact bg-base-100 p-8 rounded-lg">
                    <div className="card-body">
                        <h3 className="card-title text-xl font-semibold text-gray-900">1. Acceptance of Terms</h3>
                        <p className="mt-4 text-gray-600">
                            By accessing or using the Bytezle website or app, you agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, please discontinue the use of our services immediately.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">2. Services Provided</h3>
                        <p className="mt-4 text-gray-600">
                            Bytezle is an online platform that offers a curated selection of the latest gadgets and tech products. We provide a seamless shopping experience, connecting customers with high-quality tech innovations.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">3. User Accounts</h3>
                        <ul className="list-disc list-inside mt-4 text-gray-600">
                            <li><strong>Eligibility</strong>: Users must be at least 12 years old to create an account.</li>
                            <li><strong>Registration</strong>: When creating an account, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your login details.</li>
                            <li><strong>Termination</strong>: Bytezle reserves the right to suspend or terminate accounts that violate our terms or engage in unlawful activities.</li>
                        </ul>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">4. Orders and Payments</h3>
                        <ul className="list-disc list-inside mt-4 text-gray-600">
                            <li><strong>Placing Orders</strong>: Orders can be placed through our website or app. Upon placing an order, you will receive a confirmation with the estimated delivery time.</li>
                            <li><strong>Pricing and Availability</strong>: Prices are subject to change without prior notice. We strive to ensure all information is accurate, but errors in product descriptions, pricing, or availability may occur.</li>
                            <li><strong>Payment Methods</strong>: We accept major credit cards, debit cards, and digital payment methods. Payments must be completed at the time of order.</li>
                            <li><strong>Cancellations</strong>: Orders can be canceled within a specified timeframe. Please refer to your order confirmation for details on cancellation deadlines.</li>
                        </ul>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">5. Delivery Policy</h3>
                        <ul className="list-disc list-inside mt-4 text-gray-600">
                            <li><strong>Delivery Areas</strong>: Bytezle delivers to select regions. Enter your address during checkout to confirm availability.</li>
                            <li><strong>Delivery Times</strong>: Delivery times are estimates and may vary due to traffic, weather, or other unforeseen circumstances.</li>
                            <li><strong>Missed Deliveries</strong>: If you are unavailable to receive the order at the designated time, we will attempt to contact you to reschedule. Additional fees may apply.</li>
                        </ul>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">6. Refunds and Returns</h3>
                        <ul className="list-disc list-inside mt-4 text-gray-600">
                            <li><strong>Returns</strong>: Products can be returned within 14 days of delivery if they are defective, damaged, or not as described. The product must be in its original packaging with all accessories included.</li>
                            <li><strong>Refunds</strong>: Refunds will be processed based on the method of payment used at the time of purchase. Refunds for defective or incorrect items will be issued after an investigation.</li>
                        </ul>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">7. Promotions and Discounts</h3>
                        <p className="mt-4 text-gray-600">
                            Promotions and discount codes offered on Bytezle are subject to specific terms and may be revoked if misused. Only one discount code may be applied per order unless otherwise stated.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">8. User Conduct</h3>
                        <p className="mt-4 text-gray-600">
                            Users agree not to:
                        </p>
                        <ul className="list-disc list-inside mt-4 text-gray-600">
                            <li>Use the service for unlawful purposes or to engage in fraudulent activity.</li>
                            <li>Disrupt or interfere with the operation of the website or app.</li>
                            <li>Post any misleading, defamatory, or offensive content.</li>
                        </ul>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">9. Intellectual Property</h3>
                        <p className="mt-4 text-gray-600">
                            All content on the Bytezle platform, including text, graphics, logos, and software, is the intellectual property of Bytezle or its content suppliers. Unauthorized use or duplication of any material is prohibited.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">10. Limitation of Liability</h3>
                        <p className="mt-4 text-gray-600">
                            Bytezle shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability, if any, shall be limited to the total amount of the order placed.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">11. Changes to the Terms and Conditions</h3>
                        <p className="mt-4 text-gray-600">
                            We reserve the right to update or modify these terms at any time. Any changes will be posted on this page with an updated effective date. Continued use of our services after changes are made constitutes your acceptance of the revised terms.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">12. Privacy Policy</h3>
                        <p className="mt-4 text-gray-600">
                            Your privacy is important to us. Please review our Privacy Policy, which outlines how we collect, use, and protect your personal information when you use Bytezle. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">13. Third-Party Links</h3>
                        <p className="mt-4 text-gray-600">
                            Our website or app may contain links to third-party websites or services that are not owned or controlled by Bytezle. We do not assume responsibility for the content, privacy policies, or practices of any third-party sites. You agree that Bytezle is not liable for any damage or loss caused by your use of any third-party services.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">14. Force Majeure</h3>
                        <p className="mt-4 text-gray-600">
                            Bytezle is not liable for any failure to perform due to unforeseen circumstances or causes beyond our control, including but not limited to acts of God, natural disasters, wars, strikes, epidemics, or power outages. In such cases, we will make every effort to continue operations but may experience delays or interruptions.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">15. Customer Feedback</h3>
                        <p className="mt-4 text-gray-600">
                            We value your feedback and encourage you to reach out with suggestions, comments, or concerns. Any feedback provided by users may be used by Bytezle to improve our services. By submitting feedback, you agree to grant Bytezle a non-exclusive, royalty-free right to use, modify, and publish the feedback without any compensation to you.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">16. Consent to Electronic Communications</h3>
                        <p className="mt-4 text-gray-600">
                            By using Bytezle, you consent to receiving electronic communications from us. These communications may include notices about your account, order updates, promotions, and other important information. You can opt out of promotional emails at any time, but service-related emails are necessary for the proper functioning of the platform.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">17. Promotions, Contests, and Rewards</h3>
                        <p className="mt-4 text-gray-600">
                            From time to time, Bytezle may offer promotional events, contests, or loyalty programs. Participation in these events will be subject to specific rules and guidelines that will be provided at the time of the promotion. Bytezle reserves the right to cancel or modify any promotional event at its discretion.
                        </p>

                        <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">Contact Us</h3>
                        <p className="mt-4 text-gray-600">
                            If you have any questions about these Terms, please contact us at <a href="mailto:bytezle@gmail.com" className="text-blue-600">bytezle@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;