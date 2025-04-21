import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Code,
  Database,
  Palette,
  Terminal,
  Link as Linked,
  Radio,
  MessageSquare,
  Rocket,
  Clipboard,
  Brain,
  SwatchBook,
} from 'lucide-react'

const Footer = () => {
  const navigate = useNavigate()

  const handleNavigateToCoursesPage = (getCurrentId) => {
    sessionStorage.removeItem('filters')
    const currentFilter = {
      category: [getCurrentId],
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/courses')
    location.reload()
  }

  return (
    <footer className="bg-[#f9f9f9] text-sm text-gray-700 pt-12 border-t mt-10">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-10">
        <div>
          <div className="flex items-center text-orange-500 font-extrabold text-xl gap-2 mb-4">
            <SwatchBook className="w-7 h-7" />
            <span>EduPress</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            EduPress is your trusted platform for online learning, offering
            high-quality courses from industry experts. Unlock your potential
            and gain real-world skills anytime, anywhere.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-black mb-4">GET HELP</h4>
          <ul className="space-y-2">
            <li>
              <a href="/contact" className="hover:text-orange-500 transition">
                Contact Support
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-orange-500 transition">
                Learning Resources
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-black mb-4">CATEGORIES</h4>
          <ul className="space-y-3 text-gray-700">
            {[
              {
                id: 'software-engineer',
                label: 'Software Engineering',
                icon: <Code className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'data-engineer',
                label: 'Data Engineering',
                icon: <Database className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'ui-ux-design',
                label: 'UI/UX Design',
                icon: <Palette className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'devops',
                label: 'DevOps',
                icon: <Terminal className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'blockchain',
                label: 'Blockchain',
                icon: <Linked className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'robotics',
                label: 'Robotics',
                icon: <Radio className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'digital-marketing',
                label: 'Digital Marketing',
                icon: <MessageSquare className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'startup-business',
                label: 'Startup & Business',
                icon: <Rocket className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'product-management',
                label: 'Product Management',
                icon: <Clipboard className="w-4 h-4 text-orange-500" />,
              },
              {
                id: 'ai-ethics',
                label: 'AI & Ethics',
                icon: <Brain className="w-4 h-4 text-orange-500" />,
              },
            ].map((category) => (
              <li key={category.id} className="flex items-center gap-2">
                {category.icon}
                <button
                  onClick={() => handleNavigateToCoursesPage(category.id)}
                  className="hover:text-orange-500 transition cursor-pointer"
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-black mb-4">CONTACT US</h4>
          <p>
            123 Nguyen Trai,
            <br />
            Ha Dong, Hanoi, Vietnam
          </p>
          <p className="mt-2">Phone: +084 234 567 890</p>
          <p className="mt-1">Email: support@edupress.com</p>
        </div>
      </div>

      <div className="text-center border-t py-4 text-xs text-gray-500 relative">
        Copyright © {new Date().getFullYear()} EduPress
        <button
          className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 transition"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </div>
    </footer>
  )
}

export default Footer
