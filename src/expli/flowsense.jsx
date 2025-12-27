const FlowSenseLanding = () => {
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("explified");
  const handleLogout = () => {
    localStorage.removeItem("explified");
    window.location.reload();
  };
  return (
    <div className="bg-[#0f0f0f] text-white font-sans min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-[#23b5b5]">FlowSense</h1>
        <div className="flex items-center gap-4 pt-6  ">
          {isLoggedIn ? (
            <>
              <a
                href="/flowsense/explified/admin"
                className="bg-[#23b5b5] text-black px-5 py-2 rounded-full font-semibold hover:bg-[#1fa3a3] transition shadow-sm text-sm"
              >
                Admin
              </a>
              <button
                onClick={handleLogout}
                className="bg-[#23b5b5] text-black px-5 py-2 rounded-full font-semibold hover:bg-[#1fa3a3] transition shadow-sm text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/flowsense/explified/admin/login"
              className="bg-[#23b5b5] text-black px-5 py-2 rounded-full font-semibold hover:bg-[#1fa3a3] transition shadow-sm text-sm"
            >
              Login
            </a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Meet <span className="text-[#23b5b5]">FlowSense</span>
          <br />
          Your Smart AI Sales Assistant
        </h2>
        <p className="text-gray-400 max-w-xl mb-10">
          FlowSense helps you connect, explore our offerings, and get instant
          brochures. Let AI drive your sales conversations — faster, smarter,
          better.
        </p>
        <a
          href="/flowsense/chat"
          className="inline-block bg-[#23b5b5] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#1fa3a3] transition text-lg shadow-md mb-8"
          style={{ marginTop: "8px" }}
        >
          Chat with Us
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#121212] px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 text-white">
            What FlowSense Can Do
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Empower your business with AI-driven insights, instant brochures,
            and seamless communication.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Instant Engagement",
              desc: "Automatically greet visitors and engage them in intelligent conversations.",
              icon: "💬",
            },
            {
              title: "Brochure Delivery",
              desc: "Send product brochures instantly based on customer interests.",
              icon: "📄",
            },
            {
              title: "24/7 Assistant",
              desc: "Never miss a lead — FlowSense works round the clock for you.",
              icon: "⚡",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#1c1c1c] p-6 rounded-xl border border-gray-800 hover:border-[#23b5b5] transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-[#23b5b5] mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brochure Section */}
      <section id="brochure" className="px-6 py-20 text-center bg-[#0f0f0f]">
        <h3 className="text-3xl font-bold mb-6">Need a Brochure?</h3>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          Download our product brochures tailored to your industry — no waiting,
          no forms.
        </p>
        <a
          href="/brochure.pdf"
          download
          className="inline-block bg-[#23b5b5] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#1fa3a3] transition"
        >
          Download Brochure
        </a>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="px-6 py-20 bg-[#121212] text-center border-t border-gray-800"
      >
        <h3 className="text-3xl font-bold mb-6">Let's Connect</h3>
        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          Have questions? Want a demo? FlowSense is ready to assist you — drop
          us a message.
        </p>
        <a
          href="mailto:connect@flowsense.ai"
          className="inline-block bg-[#23b5b5] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#1fa3a3] transition"
        >
          Email Us Now
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-6 border-t border-gray-800 bg-[#0f0f0f]">
        © {new Date().getFullYear()} FlowSense. All rights reserved.
      </footer>
    </div>
  );
};

export default FlowSenseLanding;
