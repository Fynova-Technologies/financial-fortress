import { Card, CardContent } from "./ui/card";
import mission from "@/assets/mission.png";
import vision from "@/assets/vision.jpg";

export const AboutUs = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Financial Fortress</h2>
            <p className="text-gray-700 dark:text-gray-300">
              your comprehensive digital companion for mastering personal finance. We understand that managing money can feel overwhelming, which is why we've created an intuitive platform that transforms complex financial decisions into simple, actionable steps.
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              At Financial Fortress, we believe everyone deserves access to powerful financial tools, regardless of their background or expertise. Our platform brings together eight essential financial calculators and trackers under one roof, making it easier than ever to take control of your financial future.
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
                Whether you're planning your first budget, calculating mortgage payments, tracking savings goals, or preparing for retirement, our user-friendly tools provide instant insights that help you make informed decisions. We've designed every feature with real people in mind – from recent graduates tackling their first financial plans to experienced professionals optimizing their investment strategies.
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
                Our commitment goes beyond just providing calculators. We're here to demystify finance, eliminate guesswork, and give you the confidence to build the financial life you want. With real-time currency conversion, precise EMI calculations, ROI analysis, and comprehensive planning tools, Financial Fortress serves as your trusted advisor in navigating today's complex financial landscape.
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
                Join thousands of users who have already discovered the peace of mind that comes from having their finances organized, planned, and under control. Your journey to financial empowerment starts here.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <CardContent className="p-6">
                <img src={mission} alt="Our Mission" className="w-full h-[465px] object-cover rounded-lg mb-6" />
            </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <CardContent className="p-6">
                <section className="max-w-3xl mx-auto px-6 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        To democratize financial planning by providing accessible, intuitive, and powerful
                        tools that enable individuals to make informed financial decisions, achieve their
                        goals, and build lasting financial security with confidence and clarity.
                    </p>

                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        We are committed to:
                    </p>

                    <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Simplifying Complexity
                        </span>{" "}
                        – Making sophisticated financial calculations accessible to everyone
                        </li>
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Empowering Decisions
                        </span>{" "}
                        – Providing clear insights that drive smart financial choices
                        </li>
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Building Confidence
                        </span>{" "}
                        – Transforming financial anxiety into financial literacy and control
                        </li>
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Ensuring Accessibility
                        </span>{" "}
                        – Delivering professional-grade tools that anyone can use, anywhere, anytime
                        </li>
                    </ol>
                </section>
            </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <CardContent className="p-6">
                <section className="max-w-3xl mx-auto px-6 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Vision
                    </h2>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        To become the world's most trusted digital financial companion, empowering
                        millions of people globally to achieve financial freedom through intelligent
                        planning, informed decision-making, and continuous financial growth.
                    </p>

                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        We envision a future where:
                    </p>

                    <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Financial planning
                        </span>{" "}
                        is no longer a privilege of the wealthy, but a fundamental right accessible to all
                        </li>
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Every individual
                        </span>{" "}
                        has the tools and knowledge to secure their financial future
                        </li>
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Personal finance decisions
                        </span>{" "}
                        are made with confidence, clarity, and complete understanding
                        </li>
                        <li>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Financial literacy
                        </span>{" "}
                        becomes the foundation for prosperous communities worldwide
                        </li>
                    </ol>
                </section>
            </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <CardContent className="p-6">
                <img src={vision} alt="Our vision" className="w-full h-[465px] object-cover rounded-lg mb-6" />
            </CardContent>
        </Card>
    </div>

  );
}