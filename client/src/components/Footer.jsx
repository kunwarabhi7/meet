const Footer = () => {
  return (
    <footer className="bg-teal-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-teal-200 mb-2">
          © 2025 Let's Meet. All rights reserved.
        </p>
        <div className="space-x-4">
          <a href="#" className="text-teal-200 hover:text-amber-400 transition">
            About
          </a>
          <a href="#" className="text-teal-200 hover:text-amber-400 transition">
            Contact
          </a>
          <a href="#" className="text-teal-200 hover:text-amber-400 transition">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
