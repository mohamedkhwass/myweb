'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Building2, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'الرئيسية', href: '/', type: 'link' },
    { name: 'عن الشركة', href: '/#about', type: 'link' },
    { name: 'خدماتنا', href: '/services', type: 'link' },
    { name: 'منتجاتنا', href: '/products', type: 'link' },
    { name: 'أعمالنا', href: '/portfolio', type: 'link' },
    { name: 'تواصل معنا', href: '/#contact', type: 'link' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95'
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Khwass Tech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Khwass Tech
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                  للتطوير التقني
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8 rtl:space-x-reverse">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                ))}

                {/* CTA Button */}
                <Link href="/#contact">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary cursor-pointer inline-block text-sm px-4 py-2"
                  >
                    احصل على استشارة
                  </motion.span>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.span
                  whileHover={{ x: 10 }}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}

            {/* Mobile CTA Button */}
            <Link href="/#contact">
              <motion.span
                whileHover={{ x: 10 }}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-primary mt-4 cursor-pointer"
              >
                احصل على استشارة مجانية
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Navbar;
