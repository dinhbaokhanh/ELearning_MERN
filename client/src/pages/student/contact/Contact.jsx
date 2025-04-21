import React from 'react'

const Contact = () => {
  return (
    <div className="px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Contact Info + Map */}
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Info */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">Let's Talk!</h2>
            <p className="text-gray-600">
              Got questions, ideas, or just want to say hi? We’d love to hear
              from you. Our team is always ready to support and collaborate with
              passionate individuals like you.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 text-orange-500 p-2 rounded">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <p className="text-lg font-medium">+84 123 456 789</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 text-orange-500 p-2 rounded">
                  <i className="fas fa-envelope"></i>
                </div>
                <p className="text-lg font-medium">
                  <a href="mailto:hello@yourwebsite.com">
                    khanhdbao0209@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <iframe
              title="Google Map"
              className="w-full h-64 md:h-72 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.470080465591!2d105.83232241117346!3d21.013868880550884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab82601eb981%3A0xc5981aaeaa5730f2!2zTmjDoCBTw6FjaCBGQUhBU0EgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1745139623186!5m2!1svi!2s"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-500 mb-6">
            Whether you're a student, a teacher, or just a curious soul — we're
            here for you! Fill out the form below and we’ll get back to you as
            soon as possible.
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name*"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                placeholder="Your Email*"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <textarea
              placeholder="Your Message..."
              className="w-full p-3 border border-gray-300 rounded h-32"
              required
            ></textarea>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="saveInfo" />
              <label htmlFor="saveInfo" className="text-sm text-gray-600">
                Remember my details for next time
              </label>
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
